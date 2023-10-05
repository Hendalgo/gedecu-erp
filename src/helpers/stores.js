import { STORES_URL, API_INSTANCE } from "../consts/ApiUrl"

export const getStores= async(query)=>{
  try {
    const request = await API_INSTANCE.get(STORES_URL+"?"+query);

    return request.data;
  } catch (error) {
    
  }
}
export const createStore = async(form)=>{
  try {
    const request = await API_INSTANCE.post(STORES_URL, form);
    return request;
  } catch (error) {
    return error.response
  }  
}
