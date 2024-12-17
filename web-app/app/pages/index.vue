<script setup lang="ts">
  import { ref } from 'vue'
  import RouterUtil from '~/utils/router-util.ts'

  const { pushRouter } = RouterUtil()

  const authCodeFlowLogin = () => {
    const authServer = 'http://localhost:8080'
    const authEndpoint = '/realms/hello-oauth2/protocol/openid-connect/auth'
    const clientId = 'hello-web-app-client'
    const redirectUri = 'http://localhost:3000/auth-code-flow/oauth2-callback'
    const scope = encodeURIComponent('openid todo_read todo_write')
    const responseType = 'code'
    window.location.href = `${authServer}${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&prompt=consent`
  }

  const getImplicitFlowToken = () => {
    const authServer = 'http://localhost:8080'
    const authEndpoint = '/realms/hello-oauth2/protocol/openid-connect/auth'
    const clientId = 'hello-web-app-client'
    const redirectUri = 'http://localhost:3000/implicit-flow/oauth2-callback'
    const scope = encodeURIComponent('openid todo_read todo_write')
    const responseType = encodeURIComponent('token id_token')
    const nonce = crypto.randomUUID()
    window.location.href = `${authServer}${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&nonce=${nonce}&prompt=consent`
  }

  const authCodeFlowCodeRef = ref<string>(`const authCodeFlowLogin = () => {
  const authServer = 'http://localhost:8080'
  const authEndpoint = '/realms/hello-oauth2/protocol/openid-connect/auth'
  const clientId = 'hello-web-app-client'
  const redirectUri = 'http://localhost:3000/auth-code-flow/oauth2-callback'
  const scope = encodeURIComponent('openid todo_read todo_write')
  const responseType = 'code'
  window.location.href = \`\${authServer}\${authEndpoint}?client_id=\${clientId}&redirect_uri=\${redirectUri}&scope=\${scope}&response_type=\${responseType}&prompt=consent\`
}`)
  const implicitFlowCodeRef = ref<string>(`const getImplicitFlowToken = () => {
  const authServer = 'http://localhost:8080'
  const authEndpoint = '/realms/hello-oauth2/protocol/openid-connect/auth'
  const clientId = 'hello-web-app-client'
  const redirectUri = 'http://localhost:3000/implicit-flow/oauth2-callback'
  const scope = encodeURIComponent('openid todo_read todo_write')
  const responseType = encodeURIComponent('token id_token')
  const nonce = crypto.randomUUID()
  window.location.href = \`\${authServer}\${authEndpoint}?client_id=\${clientId}&redirect_uri=\${redirectUri}&scope=\${scope}&response_type=\${responseType}&nonce=\${nonce}&prompt=consent\`
}`)

</script>
<template>
  <div>
    <h1>Hello OAuth 2.0</h1>
    <div>
      <h2>Authorization Codeフローでトークン取得</h2>
        <div class="code-container">
          <div class="language-label">typescript</div>
          <pre><code>{{ authCodeFlowCodeRef }}</code></pre>
        </div>
        <button @click="authCodeFlowLogin">トークン取得</button>
    </div>
    <div>
      <h2>Implicitフローでトークン取得</h2>
        <div class="code-container">
          <div class="language-label">typescript</div>
          <pre><code>{{ implicitFlowCodeRef }}</code></pre>
        </div>
        <button @click="getImplicitFlowToken">トークン取得</button>
    </div>
    <div>
      <h2>Resource Owner Password Credentialsフローでトークン取得</h2>
        <button @click="pushRouter('/resource-owner-flow')">トークン取得</button>
    </div>
    <div>
      <h2>Client Credentialsフローでトークン取得</h2>
        <button @click="pushRouter('/client-credentials-flow')">トークン取得</button>
    </div>
  </div>
</template>
