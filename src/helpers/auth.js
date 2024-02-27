import { API_INSTANCE, updateApiInstance, AUTH_URL } from "../consts/ApiUrl";

export const refreshToken = async () => {
    const response = await API_INSTANCE.post(`${AUTH_URL}/refresh-token`,);

    const { data } = response;

    if (!data.access_token) throw new Error("El token está vacío");

    localStorage.setItem("token", data.access_token);

    updateApiInstance();

    return response;
};
