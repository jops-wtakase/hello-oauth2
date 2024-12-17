<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import RouterUtil from '~/utils/router-util.ts'

  const codeRef = ref<string>('')
  const urlRef = ref<string>('')
  const tokenResponseRef = ref<object>()
  const accessTokenRef = ref<string>('')
  const getTodosResponseRef = ref<object>()
  const addTodoResponseRef = ref<object>()
  const todoDescriptionRef = ref<string>('')
  const getAuthCodeFlowTokenCodeRef = ref<string>(`const authServer = 'http://auth-server:8080'
const issueTokenEndpoint = '/realms/hello-oauth2/protocol/openid-connect/token'
const clientId = 'hello-web-app-client'
const clientSecret = 'NdEOx8Zc7AskmRQeFri1Joa488FeRuel'
const authCodeFlowRedirectUri = 'http://localhost:3000/auth-code-flow/oauth2-callback'

const body = await readBody(event)
const response = await axios.post(
  \`\${authServer}\${issueTokenEndpoint}\`,
  {
    code: body.code,
    grant_type: 'authorization_code',
    redirect_uri: authCodeFlowRedirectUri,
    client_id: clientId,
    client_secret: clientSecret,
  },
  {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }
)
return response.data`)
  const getTodosCodeRef = ref<string>(`const resourceServer = 'http://resource-server:8081'

const body = await readBody(event)
const response = await axios.get(
  \`\${resourceServer}/todos\`,
  {
    headers: {
      Authorization: \`Bearer \${body.accessToken}\`,
    }
  }
)
return response.data`)
  const getTodosPythonCodeRef = ref<string>(`KEYCLOAK_HOST = "http://auth-server:8080"
KEYCLOAK_INTROSPECT_URL = f"{KEYCLOAK_HOST}/realms/hello-oauth2/protocol/openid-connect/token/introspect"
KEYCLOAK_GET_USERINFO_URL = f"{KEYCLOAK_HOST}/realms/hello-oauth2/protocol/openid-connect/userinfo"
KEYCLOAK_CLIENT_ID = "hello-resource-server-client"
KEYCLOAK_CLIENT_SECRET = "3QGO6blPbBJcFaffEwH3QYiUOSWU8CFL"


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
    return todos`)
  const addTodoCodeRef = ref<string>(`const resourceServer = 'http://resource-server:8081'

const body = await readBody(event)
const response = await axios.post(
  \`\${resourceServer}/todos\`,
  {
    description: body.description,
  },
  {
    headers: {
      Authorization: \`Bearer \${body.accessToken}\`,
    }
  }
)
return response.data`)
  const addTodoPythonCodeRef = ref<string>(`@app.post("/todos")
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

    return {"message": "Todo added successfully", "todo": todo}`)

  const { goToTop } = RouterUtil()

  const useGetAuthCodeFlowToken = async () => {
    tokenResponseRef.value = await $fetch('/api/getAuthCodeFlowToken', {
      method: 'POST',
      body: { code: codeRef.value }
    })
    accessTokenRef.value = tokenResponseRef?.value?.access_token || ''
  }

  const useGetTodos = async () => {
    getTodosResponseRef.value = await $fetch('/api/getTodos', {
      method: 'POST',
      body: { accessToken: accessTokenRef.value }
    })
  }

  const useAddTodo = async () => {
    if (!todoDescriptionRef.value) return
    addTodoResponseRef.value = await $fetch('/api/addTodo', {
      method: 'POST',
      body: { accessToken: accessTokenRef.value, description: todoDescriptionRef.value }
    })
  }

  onMounted(async () => {
    const params = new URL(document.location.href).searchParams
    urlRef.value = document.location.href
    const code = params.get("code")
    codeRef.value = code || ''
  })
</script>
<template>
  <div>
    <button @click="goToTop">Topへ戻る</button>
  </div>
  <div>
    <h1>Authorization Codeフロー: 認証結果</h1>
    <div>
      <h2>認可コード</h2>
      <div>{{ codeRef }}</div>
      <div class="code-container">
        <div class="language-label">url</div>
        <pre><code>{{ urlRef }}</code></pre>
      </div>
    </div>
    <div>
      <h2>認可コードを使ってトークン取得</h2>
      <div class="code-container">
        <div class="language-label">typescript</div>
        <pre><code>{{ getAuthCodeFlowTokenCodeRef }}</code></pre>
      </div>
      <button @click="useGetAuthCodeFlowToken" v-if="codeRef">トークン取得</button>
      <div v-if="tokenResponseRef">
        トークン発行レスポンス: {{ JSON.stringify(tokenResponseRef) }}
      </div>
      <div v-if="accessTokenRef">
        取得したアクセストークン: {{ accessTokenRef }}
      </div>
    </div>
    <div v-if="accessTokenRef">
      <h1>アクセストークンを使ってリソースサーバからTODO情報取得</h1>
      <div class="code-container">
        <div class="language-label">typescript</div>
        <pre><code>{{ getTodosCodeRef }}</code></pre>
      </div>
      <div class="code-container">
        <div class="language-label">python</div>
        <pre><code>{{ getTodosPythonCodeRef }}</code></pre>
      </div>
      <button @click="useGetTodos">TODO情報の取得</button>
      <div v-if="getTodosResponseRef">
        レスポンス: {{ JSON.stringify(getTodosResponseRef) }}
      </div>
    </div>
    <div v-if="accessTokenRef">
      <h1>アクセストークンを使ってリソースサーバにTODO情報追加</h1>
      <div class="code-container">
        <div class="language-label">typescript</div>
        <pre><code>{{ addTodoCodeRef }}</code></pre>
      </div>
      <div class="code-container">
        <div class="language-label">python</div>
        <pre><code>{{ addTodoPythonCodeRef }}</code></pre>
      </div>
      <input v-model="todoDescriptionRef" type="text" />
      <button @click="useAddTodo">TODO情報の追加</button>
      <div v-if="addTodoResponseRef">
        レスポンス: {{ JSON.stringify(addTodoResponseRef) }}
      </div>
    </div>
  </div>
</template>
