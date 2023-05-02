
import Axios from "axios";
import {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import TokenStorageService from "@lib/tokenStoraje"

let token = new TokenStorageService();

function getToken() {
  if (typeof window !== 'undefined') {
    // console.log('setItem', window.localStorage.getItem('jwt-token'));
    // return window.localStorage.getItem('jwt-token');
   return  token.getToken();
  }
  return '';
}

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  },
  // withCredentials: true,
});

axios.interceptors.response.use(response => {
  // console.log('aqui interceptos response', response);
  if (response.status < 5000) {
    return response;
  }
  return [];
});

axios.interceptors.request.use((config: any) => {
  // 	console.log('aqui interceptos request', value);
  // 	// if (response.status<5000){
  // 	// 	// 	return response
  // 	// 	// }
  // console.log('antes del recuest');
  config.headers.Authorization = 'Bearer ' + getToken();
  return config;
});
// const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
//   console.info(`[request] [${JSON.stringify(config.headers.)}]`);
//   return config;
// }
//
// const onRequestError = (error: AxiosError): Promise<AxiosError> => {
//   console.error(`[request error] [${JSON.stringify(error)}]`);
//   return Promise.reject(error);
// }
//
// const onResponse = (response: AxiosResponse): AxiosResponse => {
//   console.info(`[response] [${JSON.stringify(response)}]`);
//   return response;
// }
//
// const onResponseError = (error: AxiosError): Promise<AxiosError> => {
//   console.error(`[response error] [${JSON.stringify(error)}]`);
//   return Promise.reject(error);
// }
//
// export function setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
//   axiosInstance.interceptors.request.use(onRequest, onRequestError);
//   axiosInstance.interceptors.response.use(onResponse, onResponseError);
//   return axiosInstance;
// }

export default axios;
