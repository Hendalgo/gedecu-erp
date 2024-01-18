import { API_INSTANCE, CURRENCIES_URL } from "../consts/ApiUrl"

export const getCurrencies = async (query = "") => {
  try {
    const request = await API_INSTANCE.get(`${CURRENCIES_URL}?${query}`)
    return request.data
  } catch (error) {
    return []
  }
}
export const createCurrency = async (data) =>{
  try {
    const request = await API_INSTANCE.post(`${CURRENCIES_URL}`, data);
    return request;
  } catch (error) {
    return error.response
  }
}
export const updateCurrency = async (id, data) =>{
  try {
    const request = await API_INSTANCE.put(`${CURRENCIES_URL}/${id}`, data);
    return request;
  } catch (error) {
    return error.response
  }
}
export const deleteCurrency = async (id)=>{
  try {
    const request = await API_INSTANCE.delete(CURRENCIES_URL+"/"+id);
    return request;
  } catch (error) {
    return error.response;
  }
}