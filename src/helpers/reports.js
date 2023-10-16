import { REPORTS_URL, API_INSTANCE, REPORTS_TYPE_URL } from '../consts/ApiUrl'
export const getReports = async (query) => {
  try {
    const request = await API_INSTANCE.get(REPORTS_URL + '?' + query)

    return request.data
  } catch (error) {
    return error.response
  }
}
export const getInconsistences = async (query) => {
  try {
    const request = await API_INSTANCE.get(REPORTS_URL + '/inconsistences' + '?' + query)

    return request.data
  } catch (error) {
    return error.response
  }
}
export const createReport = async (form) => {
  try {
    const request = await API_INSTANCE.post(REPORTS_URL, form)

    return request
  } catch (error) {
    return error.response
  }
}
export const updateReport = async (form, id) => {
  try {
    const request = await API_INSTANCE.put(REPORTS_URL + '/' + id, form)

    return request
  } catch (error) {
    return error.response
  }
}
export const getReportTypes = async (query) => {
  try {
    const request = await API_INSTANCE.get(`${REPORTS_TYPE_URL}?${query}`)

    return request.data
  } catch (error) {
    return error.response
  }
}