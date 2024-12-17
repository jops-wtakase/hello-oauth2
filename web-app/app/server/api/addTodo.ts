import axios from 'axios'

export default defineEventHandler(async (event) => {
  const resourceServer = 'http://resource-server:8081'

  try {
    const body = await readBody(event)
    const response = await axios.post(
      `${resourceServer}/todos`,
      {
        description: body.description,
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error(`TODO情報の追加に失敗しました: ${error.message}`)
    return 'TODO情報の追加に失敗しました'
  }
})
