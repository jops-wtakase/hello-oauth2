import axios from 'axios'

export default defineEventHandler(async (event) => {
  const authServer = 'http://auth-server:8080'
  const issueTokenEndpoint = '/realms/hello-oauth2/protocol/openid-connect/token'
  const clientId = 'hello-web-app-for-resource-owner-flow'
  const clientSecret = 'PCOoWwoeb6DA6hiCOJjPxhv6Ihi3kTCW'

  try {
    const input = await readBody(event)
    const response = await axios.post(
      `${authServer}${issueTokenEndpoint}`,
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
    return response.data
  } catch (error) {
    console.error(`トークン取得エラー: ${error.message}`)
    return 'エラーが発生しました'
  }
})
