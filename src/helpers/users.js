import { API_INSTANCE, USER_URL } from '../consts/ApiUrl'

export const getUsers = async (querys) => {
  return API_INSTANCE.get(USER_URL + '?' + querys);
}
export const createUser = async (form) => {
  try {
    const request = await API_INSTANCE.post(USER_URL, form)
    return request
  } catch (error) {
    return error.response
  }
}

export const getUsersRoles = async () => {
  try {
    const request = await API_INSTANCE.get(USER_URL + '/roles')
    return request.data
  } catch (error) {
    return error.response
  }
}
export const updateUser = async (id, formData) => {
  try {
    const request = await API_INSTANCE.put(USER_URL + '/' + id, formData)
    return request
  } catch (error) {
    return error.response
  }
}
export const deleteUser = async (id) => {
  try {
    const request = await API_INSTANCE.delete(USER_URL + '/' + id)
    return request
  } catch (error) {
    return error.response
  }
}

/* Users Balances */
export const getUsersBalance = async (query = "") => {
  const response = await API_INSTANCE.get(`${USER_URL}/balances?${query}`);
  return response.data;
}