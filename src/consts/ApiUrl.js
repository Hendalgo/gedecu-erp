import axios from "axios";

const offset = new Date().getTimezoneOffset() / 60;
const hour = parseInt(Math.abs(offset));
const minutes = (Math.abs(offset) - hour) * 60;
const timeZone = `${offset > 0 ? "-" : "+"}${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

export const API_INSTANCE = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "X-Request-With": "XMLHttpRequest",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    Timezone: timeZone,
  },
  withCredentials: true,
});

export const updateApiInstance = () => {
  API_INSTANCE.defaults.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
}

export const LOGIN_URL = "/auth/login";
export const ME_URL = "/user";
export const USER_URL = "/users";
export const LOGOUT_URL = "/auth/logout";
export const REPORTS_URL = "/reports";
export const BANKS_URL = "/banks";
export const REPORTS_TYPE_URL = "/reports/types";
export const STORES_URL = "/stores";
export const COUNTRIES_URL = "/countries";
export const BANKS_COUNTRIES_URL = "/countries/banks";
export const BANK_ACCOUNTS_URL = "/bank-accounts";
export const CURRENCIES_URL = "/currencies";
export const STATISTICS_URL = "/statistics";
export const CURRENCIES_TOTAL_URL = `${STATISTICS_URL}/total-currencies`;
export const BANKS_TOTAL_URL = `${STATISTICS_URL}/total-banks`;
export const AUTH_URL = "auth";