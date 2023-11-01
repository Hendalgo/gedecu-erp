import { API_INSTANCE,BANKS_TOTAL_URL, BANKS_COUNTRIES_URL, COUNTRIES_URL } from "../consts/ApiUrl"
export const getCountriesTotal = async () => {
  try {
    const request = await API_INSTANCE.get(BANKS_TOTAL_URL)
    return request.data[0]
  } catch (error) {
    console.log(error)
    return []
  }
}
export const getCountries = async (query) => {
  try {
    const request = await API_INSTANCE.get(`${COUNTRIES_URL}?${query}`)
    return request.data[0]
  } catch (error) {
    return []
  }
}
export const createCountry = async (data) =>{
  try {
    const request = await API_INSTANCE.post(COUNTRIES_URL, data);
    return request;
  } catch (error) {
    return error.response
  }
}
export const updateCountry = async (id, data)=>{
  try {
    const request = await API_INSTANCE.put(COUNTRIES_URL+"/"+id, data);
    return request;
  } catch (error) {
    return error.response;
  }
}
export const deleteCountry = async (id)=>{
  try {
    const request = await API_INSTANCE.delete(COUNTRIES_URL+"/"+id);
    return request;
  } catch (error) {
    return error.response;
  }
}