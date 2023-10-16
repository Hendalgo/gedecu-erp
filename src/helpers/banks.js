import { BANKS_URL, API_INSTANCE, BANKS_TOTAL_URL, BANKS_COUNTRIES_URL } from '../consts/ApiUrl'

export const getBanks = async (querys) => {
  try {
    const request = await API_INSTANCE.get(BANKS_URL + '?' + querys)
    return request.data
  } catch (error) {
    return error.response
  }
}
export const getBank = async (id) => {
  try {
    const request = await API_INSTANCE.get(BANKS_URL + '/' + id)
    return request.data
  } catch (error) {

  }
}
export const createBank = async (form) => {
  try {
    const request = await API_INSTANCE.post(BANKS_URL, form)
    return request
  } catch (error) {
    return error.response
  }
}
export const updateBank = async (id, formData) => {
  try {
    const request = await API_INSTANCE.put(BANKS_URL + '/' + id, formData)
    return request
  } catch (error) {
    return error.response
  }
}
export const getBanksTotal = async () => {
  try {
    const request = await API_INSTANCE.get(BANKS_TOTAL_URL)
    return request.data[0]
  } catch (error) {
    console.log(error)
    return []
  }
}
export const getCountriesCount = async () => {
  try {
    const request = await API_INSTANCE.get(BANKS_COUNTRIES_URL)

    return request.data
  } catch (error) {
    console.log(error)
    return []
  }
}