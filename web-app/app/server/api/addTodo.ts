import axios from 'axios'

export default defineEventHandler(async (event) => {
  const resourceServer = 'http://resource-server:8081'

  try {
    const input = await readBody(event)
    const response = await axios.post(
      `${resourceServer}/todos`,
      {
        description: input.description,
      },
      {
        headers: {
          Authorization: `Bearer ${input.accessToken}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error(`TODO情報の追加に失敗しました: ${error.message}`)
    return 'TODO情報の追加に失敗しました'
  }
})
