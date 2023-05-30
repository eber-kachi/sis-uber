import Axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { Redirect } from "next";
import TokenStorageService from "@lib/tokenStoraje";

const token = new TokenStorageService();

function getToken() {
  if (typeof window !== "undefined") {
    // console.log('setItem', window.localStorage.getItem('jwt-token'));
    // return window.localStorage.getItem('jwt-token');
    return token.getToken();
  }
  console.log("=>>>>>>>>>>>>>>>   mandamdo sin token");
  return "";
}

const logOnDev = (message: string) => {
  // if (import.meta.env.MODE === "development") {
  console.log(message);
  // }
};

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
  // withCredentials: true,
});

axios.interceptors.response.use(
  (response) => {
    console.log("=======================>>aqui interceptos response");
    // debugger;
    if (response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }

    if (response.status < 5000) {
      return response;
    }
    return [];
    // return ;
  },
  (error) => {
    const message = error?.message;
    const method = error?.config?.method;
    const url = error?.config?.url;
    // const { method, url } = error?.config as AxiosRequestConfig;
    const { statusText, status } = (error?.response as AxiosResponse) ?? {};

    logOnDev(`🚨 [API] ==> ${method} ${url} | Error ${status} ${message}`);
    //
    if (status === 401) {
      // Delete Token & Go To Login Page if you required.
      // token.signOut();
      // Redirect("/login")
      console.log("mandar a login=>");
    }

    // } else {
    //   logOnDev(`🚨 [API] | Error ${error.message}`)
    // }

    return Promise.reject(error);
  }
);

axios.interceptors.request.use((config: any) => {
  console.log("aqui interceptos request");
  // 	// if (response.status<5000){
  // 	// 	// 	return response
  // 	// 	// }
  // console.log('antes del recuest');
  config.headers.Authorization = `Bearer ${getToken()}`;
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
