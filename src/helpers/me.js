import { ME_URL, API_INSTANCE } from "../consts/ApiUrl";

export const me = async () => {
  const token = localStorage.getItem("token");

  if (!token) throw new Error();

  const request = await API_INSTANCE.get(ME_URL);
  return request;
};
