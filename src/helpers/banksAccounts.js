import { BANK_ACCOUNTS_URL, API_INSTANCE} from '../consts/ApiUrl'

export const getBankAccounts = async (querys)=>{
  try {
    const request = await API_INSTANCE.get(BANK_ACCOUNTS_URL + '?' + querys)
    return request.data
  } catch (error) {
    return error.response
  }
}

export const getBankAccount = async (id)=>{
  throw new Error(`Prueba de error con el id ${id}`);
}

export const createBankAccount = async(form)=>{
  try {
    const request = await API_INSTANCE.post(BANK_ACCOUNTS_URL, form)
    return request
  } catch (error) {
    return error.response
  }
}

export const updateBankAccount = async(id, form)=>{
  try {
    const request = await API_INSTANCE.put(BANK_ACCOUNTS_URL+"/"+id, form)
    return request
  } catch (error) {
    return error.response
  }
}
export const deleteBankAccount = async(id)=>{
  try {
    const request = await API_INSTANCE.delete(BANK_ACCOUNTS_URL+"/"+id)
    return request
  } catch (error) {
    return error.response
  }
}