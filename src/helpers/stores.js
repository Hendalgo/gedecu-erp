import { STORES_URL, API_INSTANCE } from "../consts/ApiUrl"

export const getStores= async(query)=>{
  try {
    const request = await API_INSTANCE.get(STORES_URL+"?"+query);

    return request.data;
  } catch (error) {
    
  }
}