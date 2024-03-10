import { REPORTS_URL, API_INSTANCE, REPORTS_TYPE_URL } from "../consts/ApiUrl";

/**
 * Reports
 */
export const getReports = async (query = "") => {
  const request = await API_INSTANCE.get(REPORTS_URL + "?" + query);
  return request.data;
};

export const getReportById = async (id) => {
  const response = await API_INSTANCE.get(`${REPORTS_URL}/${id}`);
  return response.data;
};

export const createReport = async (data) => {
  return API_INSTANCE.post(REPORTS_URL, data);
};

export const updateReport = async (form, id) => {
  try {
    const request = await API_INSTANCE.put(REPORTS_URL + "/" + id, form);

    return request;
  } catch (error) {
    return error.response;
  }
};

/**
 * Inconsistences
 */
export const getInconsistences = async (query) => {
  const response = await API_INSTANCE.get("inconsistences" + "?" + query);
  return response.data;
};

export const patchInconsistence = async (id) => {
  const response = await API_INSTANCE.patch(`inconsistences/verify/${id}`);
  return response;
};

export const patchInconsistencesMassive = async () => {
  const response = await API_INSTANCE.patch(`inconsistences/verify/all`);
  return response;
};

/**
 * Report types
 */
export const getReportTypes = async (query = "") => {
  try {
    const request = await API_INSTANCE.get(`${REPORTS_TYPE_URL}?${query}`);

    return request.data;
  } catch (error) {
    return error.response;
  }
};
export const createReportTypes = async (data) => {
  try {
    const request = await API_INSTANCE.post(REPORTS_TYPE_URL, data);

    return request;
  } catch (error) {
    return error.response;
  }
};
export const deleteReportTypes = async (id) => {
  try {
    const request = await API_INSTANCE.delete(`${REPORTS_TYPE_URL}/${id}`);

    return request;
  } catch (error) {
    return error.response;
  }
};

export const updateReportTypes = async (id, data) => {
  try {
    const request = await API_INSTANCE.put(`${REPORTS_TYPE_URL}/${id}`, data);

    return request;
  } catch (error) {
    return error.response;
  }
};

/**
 * Duplicates
 */
export const getDuplicates = async (query = "") => {
  const response = await API_INSTANCE.get(`${REPORTS_URL}/duplicated?${query}`);
  return response.data;
};

export const getDuplicateById = async (id) => {
  const response = await API_INSTANCE.get(`${REPORTS_URL}/duplicated/${id}`);
  return response.data;
};

export const updateDuplicate = async (id, data) => {
  const response = await API_INSTANCE.put(
    `${REPORTS_URL}/duplicated/${id}`,
    data,
  );
  return response.data;
};

/**
 * Subreports
 */

export const updateSubreport = async (id, data) => {
  return `${REPORTS_URL}/subreports/${id}`;
  // const response = await API_INSTANCE.put();
  // return response;
}

export const deleteSubreport = async (id) => {
  const response = await API_INSTANCE.delete(`${REPORTS_URL}/subreports/${id}`);
  return response;
}