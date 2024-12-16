<script setup lang="ts">
  import { ref } from 'vue'

  const authCodeFlowLogin = () => {
    const authServer = 'http://localhost:8080'
    const authEndpoint = '/realms/hello-oauth2/protocol/openid-connect/auth'
    const clientId = 'hello-web-app-client'
    const redirectUri = 'http://localhost:5173/oauth2callback'
    const scope = encodeURIComponent('openid todo_read todo_write')
    window.location.href = `${authServer}${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&prompt=consent`
  }

  const authCodeFlowCodeRef = ref<string>(`const authCodeFlowLogin = () => {
  const authServer = 'http://localhost:8080'
  const authEndpoint = '/realms/hello-oauth2/protocol/openid-connect/auth'
  const clientId = 'hello-web-app-client'
  const redirectUri = 'http://localhost:5173/oauth2callback'
  const scope = encodeURIComponent('openid todo_read todo_write')
  window.location.href = \`\${authServer}\${authEndpoint}?client_id=\${clientId}&redirect_uri=\${redirectUri}&scope=\${scope}&response_type=code&prompt=consent\`
}`)
</script>
<template>
  <div>
    <h1>トップページ</h1>
    <div>
      <h2>認可コードフローでトークン取得</h2>
        <div class="code-container">
          <div class="language-label">typescript</div>
          <pre><code>{{ authCodeFlowCodeRef }}</code></pre>
        </div>
        <button @click="authCodeFlowLogin">トークン取得</button>
    </div>
  </div>
</template>
