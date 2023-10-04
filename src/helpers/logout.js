import {API_INSTANCE, LOGOUT_URL } from "../consts/ApiUrl"

export const logout = async()=>{
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return new Error();
    }
    const request = await API_INSTANCE.post(LOGOUT_URL);
    localStorage.removeItem('token')
    return request;
  } catch (error) {
    return error.response;
  }
}