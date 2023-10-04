import { LOGIN_URL, API_INSTANCE } from "../consts/ApiUrl"

export const login = async (formData)=>{
  try {
    const response = await API_INSTANCE.post(LOGIN_URL, formData);
    return response;
  } catch (error) {
    if (error.response) {
      return error.response
    }
  }
}