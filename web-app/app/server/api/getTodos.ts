import axios from 'axios'

export default defineEventHandler(async (event) => {
  const resourceServer = 'http://resource-server:8081'

  try {
    const input = await readBody(event)
    const response = await axios.get(
      `${resourceServer}/todos`,
      {
        headers: {
          Authorization: `Bearer ${input.accessToken}`,
        }
      }
    )
    return response.data
  } catch (error) {
    console.error(`TODO情報の取得に失敗しました: ${error.message}`)
    return 'TODO情報の取得に失敗しました'
  }
})
