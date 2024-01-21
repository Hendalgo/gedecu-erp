import { REPORTS_URL, API_INSTANCE, REPORTS_TYPE_URL } from '../consts/ApiUrl'
export const getReports = async (query) => {
  const request = await API_INSTANCE.get(REPORTS_URL + '?' + query);
  return request.data
}
export const getInconsistences = async (query) => {
  try {
    const request = await API_INSTANCE.get(REPORTS_URL + '/inconsistences' + '?' + query)

    return request.data
  } catch (error) {
    return error.response
  }
}

export const getReportById = async (id) => {
  const response = await API_INSTANCE.get(`${REPORTS_URL}/${id}`);
  return response.data;
}

export const createReport = async (data) => {
  return API_INSTANCE.post(REPORTS_URL, data);
}
export const updateReport = async (form, id) => {
  try {
    const request = await API_INSTANCE.put(REPORTS_URL + '/' + id, form)

    return request
  } catch (error) {
    return error.response
  }
}
export const getReportTypes = async (query = "") => {
  try {
    const request = await API_INSTANCE.get(`${REPORTS_TYPE_URL}?${query}`)

    return request.data
  } catch (error) {
    return error.response
  }
}
export const createReportTypes = async(data)=>{
  try {
    const request = await API_INSTANCE.post(REPORTS_TYPE_URL, data)

    return request
  } catch (error) {
    return error.response
  }
}
export const deleteReportTypes = async(id)=>{
  try {
    const request = await API_INSTANCE.delete(`${REPORTS_TYPE_URL}/${id}`)

    return request
  } catch (error) {
    return error.response
  }
}

export const updateReportTypes = async(id,data)=>{
  try {
    const request = await API_INSTANCE.put(`${REPORTS_TYPE_URL}/${id}`, data)

    return request
  } catch (error) {
    return error.response
  }
}

export const getDuplicates = async (query = "") => {
  const response = await API_INSTANCE.get(`${REPORTS_TYPE_URL}/duplicates?${query}`);
  return response.data;
}
