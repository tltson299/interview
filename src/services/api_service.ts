import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import qs from 'qs';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const GET = async (url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<any> => {
  return await api
    .get(url, {
      ...config,
      params: data,
      paramsSerializer: (params: Record<string, any>) => {
        return qs.stringify(params);
      },
    })
    .then((response: AxiosResponse) => {
      return response?.data;
    })
    .catch((error: AxiosError) => {
      return Promise.reject(error);
    });
};

const ApiService = {
  GET,
};

export default ApiService;
