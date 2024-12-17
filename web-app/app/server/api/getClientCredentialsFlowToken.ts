import axios from 'axios'

export default defineEventHandler(async (event) => {
  const authServer = 'http://auth-server:8080'
  const issueTokenEndpoint = '/realms/hello-oauth2/protocol/openid-connect/token'
  const clientId = 'hello-web-app-client'
  const clientSecret = 'NdEOx8Zc7AskmRQeFri1Joa488FeRuel'

  try {
    const input = await readBody(event)
    const response = await axios.post(
      `${authServer}${issueTokenEndpoint}`,
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
    return response.data
  } catch (error) {
    console.error(`トークン取得エラー: ${error.message}`)
    return 'エラーが発生しました'
  }
})
