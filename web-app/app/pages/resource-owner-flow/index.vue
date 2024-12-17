<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import RouterUtil from '~/utils/router-util.ts'

  const tokenResponseRef = ref<object>()
  const accessTokenRef = ref<string>()
  const getTodosResponseRef = ref<object>()
  const addTodoResponseRef = ref<object>()
  const todoDescriptionRef = ref<string>()
  const usernameRef = ref<string>()
  const passwordRef = ref<string>()
  const getResourceOwnerFlowTokenCodeRef = ref<string>(`const authServer = 'http://auth-server:8080'
const issueTokenEndpoint = '/realms/hello-oauth2/protocol/openid-connect/token'
const clientId = 'hello-web-app-for-resource-owner-flow'
const clientSecret = 'PCOoWwoeb6DA6hiCOJjPxhv6Ihi3kTCW'

const input = await readBody(event)
const response = await axios.post(
  \`\${authServer}\${issueTokenEndpoint}\`,
  {
    grant_type: 'password',
    client_id: clientId,
    client_secret: clientSecret,
    username: input.username,
    password: input.password,
    scope: input.scope,
  },
  {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }
)
return response.data`)

  const { goToTop } = RouterUtil()

  const useGetResourceOwnerFlowToken = async () => {
    if (!usernameRef.value || !passwordRef.value) return
    tokenResponseRef.value = await $fetch('/api/getResourceOwnerFlowToken', {
      method: 'POST',
      body: {
        username: usernameRef.value,
        password: passwordRef.value,
        scope: 'openid todo_read todo_write',
      }
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
</script>
<template>
  <div>
    <button @click="goToTop">Topへ戻る</button>
  </div>
  <div>
    <h1>Resource Owner Password Credentialsフロー</h1>
    <div>
      <h2>usernameとpasswordを渡してトークン取得</h2>
      <div class="code-container">
        <div class="language-label">typescript</div>
        <pre><code>{{ getResourceOwnerFlowTokenCodeRef }}</code></pre>
      </div>
      <div>username: <input v-model="usernameRef" type="text" /></div>
      <div>password: <input v-model="passwordRef" type="password" /></div>
      <div>scope: openid todo_read todo_write</div>
      <button @click="useGetResourceOwnerFlowToken">トークン取得</button>
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
      <button @click="useGetTodos">TODO情報の取得</button>
      <div v-if="getTodosResponseRef">
        <h3>レスポンス:</h3>
        <div><pre>{{ JSON.stringify(getTodosResponseRef, null, 2) }}</pre></div>
      </div>
    </div>
    <div v-if="accessTokenRef">
      <h1>アクセストークンを使ってリソースサーバにTODO情報追加</h1>
      <input v-model="todoDescriptionRef" type="text" />
      <button @click="useAddTodo">TODO情報の追加</button>
      <div v-if="addTodoResponseRef">
        <h3>レスポンス:</h3>
        <div><pre>{{ JSON.stringify(addTodoResponseRef, null, 2) }}</pre></div>
      </div>
    </div>
  </div>
</template>
