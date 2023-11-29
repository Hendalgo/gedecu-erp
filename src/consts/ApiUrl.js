import axios from 'axios'

export const API_INSTANCE = axios.create({
  baseURL: 'https://gedecu.xn--lissexpertespaa-crb.com/api',
  headers: {
    'X-Request-Width': 'XMLHttpRequest',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  },
  withCredentials: true
})
export const LOGIN_URL = '/auth/login'
export const ME_URL = '/user'
export const USER_URL = '/users'
export const LOGOUT_URL = '/auth/logout'
export const REPORTS_URL = '/reports'
export const BANKS_URL = '/banks'
export const BANKS_TOTAL_URL = '/banks/total'
export const REPORTS_TYPE_URL = '/reports/types'
export const STORES_URL = '/stores'
export const COUNTRIES_URL = '/countries'
export const BANKS_COUNTRIES_URL = '/countries/banks'
export const BANK_ACCOUNTS_URL = '/bank-accounts'
export const CURRENCIES_URL = '/currencies'