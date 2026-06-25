/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'

const BaseMethods = {
  async deleteRequest(url: string, isAuthRequired: boolean): Promise<AxiosResponse> {
    const headers = isAuthRequired ? BaseMethods.getHeadersAuth() : BaseMethods.getHeaders()

    const config: AxiosRequestConfig = {
      headers,
      method: 'DELETE',
      url,
    }

    return axios(config)
  },

  ////////////////// Internal usage //////////////////////
  getHeaders: (isFile?: boolean) => {
    const headers = {
      Accept: 'application/json',
      'Content-Type': isFile ? 'multipart/form-data' : 'application/json',
    }
    return headers
  },

  getHeadersAuth: (isFile?: boolean) => {
    const headers = BaseMethods.getHeaders(isFile)
    let token = ''
    try {
      const raw = localStorage.getItem('user')
      if (raw) {
        token = (JSON.parse(raw) as { access_token?: string }).access_token ?? ''
      }
    } catch {
      localStorage.removeItem('user')
      token = ''
    }
    const copyHeaders = {
      Authorization: `Bearer ${token}`,
      ...headers,
    }
    return copyHeaders
  },

  async getRequest(
    url: string,
    isAuthRequired: boolean,
    parameters?: Record<string, any>,
  ): Promise<AxiosResponse> {
    const headers = isAuthRequired ? BaseMethods.getHeadersAuth() : BaseMethods.getHeaders()

    const config: AxiosRequestConfig = {
      headers,
      method: 'GET',
      params: parameters || {},
      url,
    }

    return axios(config)
  },

  async patchRequest(url: string, body: unknown, isAuthRequired: boolean): Promise<AxiosResponse> {
    const headers = isAuthRequired ? BaseMethods.getHeadersAuth() : BaseMethods.getHeaders()

    const config: AxiosRequestConfig = {
      data: body,
      headers,
      method: 'PATCH',
      url,
    }

    return axios(config)
  },

  async postFileRequest(
    url: string,
    body: unknown,
    isAuthRequired: boolean,
  ): Promise<AxiosResponse> {
    const headers = isAuthRequired ? BaseMethods.getHeadersAuth(true) : BaseMethods.getHeaders(true)

    const config: AxiosRequestConfig = {
      data: body,
      headers,
      method: 'POST',
      url,
    }
    console.log({ config })

    return axios(config)
  },

  ///////////////////// External usage ////////////////////
  async postRequest(url: string, body: unknown, isAuthRequired: boolean): Promise<AxiosResponse> {
    const headers = isAuthRequired ? BaseMethods.getHeadersAuth() : BaseMethods.getHeaders()

    const config: AxiosRequestConfig = {
      data: body,
      headers,
      method: 'POST',
      url,
    }

    return axios(config)
  },

  async putFileRequest(
    url: string,
    body: unknown,
    isAuthRequired: boolean,
  ): Promise<AxiosResponse> {
    const headers = isAuthRequired ? BaseMethods.getHeadersAuth(true) : BaseMethods.getHeaders(true)

    const config: AxiosRequestConfig = {
      data: body,
      headers,
      method: 'PUT',
      url,
    }

    return axios(config)
  },

  async putRequest(url: string, body: unknown, isAuthRequired: boolean): Promise<AxiosResponse> {
    const headers = isAuthRequired ? BaseMethods.getHeadersAuth() : BaseMethods.getHeaders()

    const config: AxiosRequestConfig = {
      data: body,
      headers,
      method: 'PUT',
      url,
    }

    return axios(config)
  },
}

export default BaseMethods
