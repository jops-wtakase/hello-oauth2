from base64 import b64encode
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
import httpx
import os
import psycopg2
from pydantic import BaseModel


KEYCLOAK_HOST = "http://auth-server:8080"
KEYCLOAK_INTROSPECT_URL = f"{KEYCLOAK_HOST}/realms/hello-oauth2/protocol/openid-connect/token/introspect"
KEYCLOAK_GET_USERINFO_URL = f"{KEYCLOAK_HOST}/realms/hello-oauth2/protocol/openid-connect/userinfo"
KEYCLOAK_CLIENT_ID = "hello-resource-server-client"
KEYCLOAK_CLIENT_SECRET = "3QGO6blPbBJcFaffEwH3QYiUOSWU8CFL"


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class Todo(BaseModel):
    description: str


class TokenIntrospectionResponse(BaseModel):
    active: bool
    scope: str
    sub: str
    exp: int
    iat: int


async def introspect_token(token: str):
    credentials = f"{KEYCLOAK_CLIENT_ID}:{KEYCLOAK_CLIENT_SECRET}"
    encoded_credentials = b64encode(credentials.encode()).decode()

    async with httpx.AsyncClient() as client:
        response = await client.post(
            KEYCLOAK_INTROSPECT_URL,
            data={
                "token": token,
            },
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": f"Basic {encoded_credentials}",
            }
        )
        response.raise_for_status()
        return response.json()


async def get_userinfo(token: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            KEYCLOAK_GET_USERINFO_URL,
            headers={
                "Authorization": f"Bearer {token}",
            }
        )
        response.raise_for_status()
        return response.json()


@app.get("/todos")
async def get_todos(token: str = Depends(oauth2_scheme)):
    introspection_response = await introspect_token(token)
    if not introspection_response["active"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is not active or invalid"
        )
    
    if "todo_read" not in introspection_response["scope"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Missing required scope: todo_read"
        )

    get_userinfo_response = await get_userinfo(token)
    auth_user_id = get_userinfo_response["sub"]
    todos = get_todos_from_db(auth_user_id)

    return todos


@app.post("/todos")
async def add_todo(todo: Todo, token: str = Depends(oauth2_scheme)):
    introspection_response = await introspect_token(token)
    if not introspection_response["active"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is not active or invalid"
        )

    if "todo_write" not in introspection_response["scope"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Missing required scope: todo_write"
        )

    get_userinfo_response = await get_userinfo(token)
    auth_user_id = get_userinfo_response["sub"]

    add_todo_to_db(auth_user_id, todo)

    return {"message": "Todo added successfully", "todo": todo}


def get_todos_from_db(auth_user_id: str):
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USERNAME"),
        password=os.getenv("DB_PASSWORD")
    )
    cursor = conn.cursor()
    cursor.execute(f"SELECT t.description FROM todos t JOIN users u ON t.user_id = u.user_id WHERE u.auth_user_id = '{auth_user_id}';")
    todos = cursor.fetchall()
    cursor.close()
    conn.close()
    return [todo[0] for todo in todos] if todos else []


def add_todo_to_db(auth_user_id: str, todo: Todo):
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USERNAME"),
        password=os.getenv("DB_PASSWORD")
    )
    cursor = conn.cursor()

    try:
        cursor.execute(f"SELECT user_id FROM users WHERE auth_user_id = %s;", (auth_user_id,))
        user_id = cursor.fetchone()

        if user_id is None:
            raise ValueError("User not found")

        user_id = user_id[0]

        cursor.execute(
            "INSERT INTO todos (user_id, description) VALUES (%s, %s);",
            (user_id, todo.description)
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise ValueError(f"Error adding todo: {e}")
    finally:
        cursor.close()
        conn.close()
