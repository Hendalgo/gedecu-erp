import { ME_URL, API_INSTANCE } from '../consts/ApiUrl'

export const me = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      return new Error()
    }
    const request = await API_INSTANCE.get(ME_URL)

    return request
  } catch (error) {
    return error.response
  }
}
