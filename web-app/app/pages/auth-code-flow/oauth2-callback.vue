<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import RouterUtil from '~/utils/router-util.ts'

  const codeRef = ref<string>()
  const urlRef = ref<string>()
  const tokenResponseRef = ref<object>()
  const accessTokenRef = ref<string>()
  const getTodosResponseRef = ref<object>()
  const addTodoResponseRef = ref<object>()
  const todoDescriptionRef = ref<string>()
  const getAuthCodeFlowTokenCodeRef = ref<string>(`const authServer = 'http://auth-server:8080'
const issueTokenEndpoint = '/realms/hello-oauth2/protocol/openid-connect/token'
const clientId = 'hello-web-app-client'
const clientSecret = 'NdEOx8Zc7AskmRQeFri1Joa488FeRuel'
const authCodeFlowRedirectUri = 'http://localhost:3000/auth-code-flow/oauth2-callback'

const input = await readBody(event)
const response = await axios.post(
  \`\${authServer}\${issueTokenEndpoint}\`,
  {
    code: input.code,
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

const input = await readBody(event)
const response = await axios.get(
  \`\${resourceServer}/todos\`,
  {
    headers: {
      Authorization: \`Bearer \${input.accessToken}\`,
    }
  }
)
return response.data`)
  const getTodosPythonCodeRef = ref<string>(`AUTH_SERVER = "http://auth-server:8080"
INTROSPECT_URL = f"{AUTH_SERVER}/realms/hello-oauth2/protocol/openid-connect/token/introspect"
GET_USERINFO_URL = f"{AUTH_SERVER}/realms/hello-oauth2/protocol/openid-connect/userinfo"
RESOURCE_SERVER_CLIENT_ID = "hello-resource-server-client"
RESOURCE_SERVER_CLIENT_SECRET = "3QGO6blPbBJcFaffEwH3QYiUOSWU8CFL"
WEB_APP_CLIENT_SERVICE_ACCOUNT_ID = "a11f63fc-3626-4c4b-9c2e-8b812c04db57"


async def introspect_token(token: str):
    credentials = f"{RESOURCE_SERVER_CLIENT_ID}:{RESOURCE_SERVER_CLIENT_SECRET}"
    encoded_credentials = b64encode(credentials.encode()).decode()

    async with httpx.AsyncClient() as client:
        response = await client.post(
            INTROSPECT_URL,
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
            GET_USERINFO_URL,
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

    if auth_user_id == WEB_APP_CLIENT_SERVICE_ACCOUNT_ID:
        # Client Credentialsトークンの場合はユーザからのアクセスではなくHello Web Appからのアクセスとみなし全件取得する
        return get_all_todos_from_db()
    else:
        return get_todos_from_db(auth_user_id)`)
  const addTodoCodeRef = ref<string>(`const resourceServer = 'http://resource-server:8081'

const input = await readBody(event)
const response = await axios.post(
  \`\${resourceServer}/todos\`,
  {
    description: input.description,
  },
  {
    headers: {
      Authorization: \`Bearer \${input.accessToken}\`,
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
      <div><pre>{{ codeRef }}</pre></div>
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
        <h3>トークン発行レスポンス:</h3>
        <div><pre>{{ JSON.stringify(tokenResponseRef, null, 2) }}</pre></div>
      </div>
      <div v-if="accessTokenRef">
        <h3>取得したアクセストークン:</h3>
        <div><pre>{{ accessTokenRef }}</pre></div>
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
        <h3>レスポンス:</h3>
        <div><pre>{{ JSON.stringify(getTodosResponseRef, null, 2) }}</pre></div>
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
        <h3>レスポンス:</h3>
        <div><pre>{{ JSON.stringify(addTodoResponseRef, null, 2) }}</pre></div>
      </div>
    </div>
  </div>
</template>
