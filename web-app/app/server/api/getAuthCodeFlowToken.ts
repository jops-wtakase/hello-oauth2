import axios from 'axios'

export default defineEventHandler(async (event) => {
  const authServer = 'http://auth-server:8080'
  const issueTokenEndpoint = '/realms/hello-oauth2/protocol/openid-connect/token'
  const clientId = 'hello-web-app-client'
  const clientSecret = 'NdEOx8Zc7AskmRQeFri1Joa488FeRuel'
  const authCodeFlowRedirectUri = 'http://localhost:3000/auth-code-flow/oauth2-callback'

  try {
    const body = await readBody(event)
    const response = await axios.post(
      `${authServer}${issueTokenEndpoint}`,
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
    return response.data
  } catch (error) {
    console.error(`トークン取得エラー: ${error.message}`)
    return 'エラーが発生しました'
  }
})
