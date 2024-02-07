import { API_INSTANCE, STATISTICS_URL } from "../consts/ApiUrl"

export const getMovementStatistics = async (query = "") => {
    const response = await API_INSTANCE.get(`${STATISTICS_URL}?${query}`);
    return response.data;
}