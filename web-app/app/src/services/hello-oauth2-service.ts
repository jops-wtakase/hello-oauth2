import axios from 'axios'


export default function () {
  const authServer = 'http://localhost:8080'
  const issueTokenEndpoint = '/realms/hello-oauth2/protocol/openid-connect/token'
  const clientId = 'hello-web-app-client'
  const clientSecret = 'NdEOx8Zc7AskmRQeFri1Joa488FeRuel'
  const redirectUri = 'http://localhost:5173/oauth2callback'
  const resourceServer = 'http://localhost:8081'

  const fetchAuthCodeToken = async (code: string) => {
    try {
      const response = await axios.post(
        `${authServer}${issueTokenEndpoint}`,
        {
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      return response.data
    } catch (error) {
      console.error(`トークン取得エラー: ${error}`)
      return 'エラーが発生しました'
    }
  }

  const fetchTodos = async (accessToken: string) => {
    try {
      const response = await axios.get(
        `${resourceServer}/todos`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      return response.data
    } catch (error) {
      console.error(`TODO情報の取得に失敗しました: ${error}`)
      return 'TODO情報の取得に失敗しました'
    }
  }

  const addTodo = async (accessToken: string, description: string) => {
    try {
      const response = await axios.post(
        `${resourceServer}/todos`,
        {
          description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      return response.data
    } catch (error) {
      console.error(`TODO情報の追加に失敗しました: ${error}`)
      return 'TODO情報の追加に失敗しました'
    }
  }

  return {
    fetchAuthCodeToken,
    fetchTodos,
    addTodo,
  }
}
