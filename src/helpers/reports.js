import { REPORTS_URL, API_INSTANCE, REPORTS_TYPE_URL } from "../consts/ApiUrl"
export const getReports = async(query)=>{
  try {
    const request = await API_INSTANCE.get(REPORTS_URL+"?"+query);

    return request.data;
  } catch (error) {
    
  }
}

export const getReportTypes = async(query)=>{
  try {
    const request = await API_INSTANCE.get(`${REPORTS_TYPE_URL}?${query}`);

    return request.data;
  } catch (error) {
    
  }
}