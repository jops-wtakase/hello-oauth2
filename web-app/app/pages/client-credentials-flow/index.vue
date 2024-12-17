<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import RouterUtil from '~/utils/router-util.ts'

  const tokenResponseRef = ref<object>()
  const accessTokenRef = ref<string>()
  const getTodosResponseRef = ref<object>()
  const addTodoResponseRef = ref<object>()
  const todoDescriptionRef = ref<string>()
  const getClientCredentialsFlowTokenCodeRef = ref<string>(`const authServer = 'http://auth-server:8080'
const issueTokenEndpoint = '/realms/hello-oauth2/protocol/openid-connect/token'
const clientId = 'hello-web-app-client'
const clientSecret = 'NdEOx8Zc7AskmRQeFri1Joa488FeRuel'

const input = await readBody(event)
const response = await axios.post(
  \`\${authServer}\${issueTokenEndpoint}\`,
  {
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
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

  const useGetClientCredentialsFlowToken = async () => {
    tokenResponseRef.value = await $fetch('/api/getClientCredentialsFlowToken', {
      method: 'POST',
      body: {
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
    <h1>Client Credentialsフロー</h1>
    <div>
      <h2>client_idとclient_secretでトークン取得: ユーザ認証せずにHello Web App向けのclient情報でトークンをとる</h2>
      <div class="code-container">
        <div class="language-label">typescript</div>
        <pre><code>{{ getClientCredentialsFlowTokenCodeRef }}</code></pre>
      </div>
      <div>scope: openid todo_read todo_write</div>
      <button @click="useGetClientCredentialsFlowToken">トークン取得</button>
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
