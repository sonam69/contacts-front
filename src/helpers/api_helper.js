import axios from "axios"

const API_URL = process.env.REACT_APP_ENV === "production" ? process.env.REACT_APP_APIBASEURL : process.env.REACT_APP_APIBASEURL_DEV

const axiosApi = axios.create({
    baseURL: API_URL
})

axiosApi.interceptors.request.use(function (config) {
  config.headers = {
    ...config.headers,
    'Authorization': 'Bearer ' + localStorage.getItem("accessToken")
  };
  return config;
});

export async function get(url, params = {}) {
  return await axiosApi
    .get(url, { params })
    .then(response => response.data)
}

export async function post(url, data, params = {}) {
  return axiosApi
    .post(url, data, { params })
    .then(response => response.data)
}

export async function put(url, data, params = {}) {
  return axiosApi
    .put(url, data, { params })
    .then(response => response.data)
}

export async function patch(url, data, params = {}) {
  return axiosApi
    .patch(url, data , { params })
    .then( response => response.data)
}

export async function del(url, params = {}) {
  return axiosApi
    .delete(url, { params })
    .then( response => response.data)
}
