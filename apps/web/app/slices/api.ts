/*
Creation of API Calls via the function 'makeApiPayload'

Provides the function to prepare the initial login API call:
    getLoginPayload

All other API call preparations are done in the saga javascript per 
  slice

*/

interface ApiPayload {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  withCredentials: boolean;
  headers: Record<string, string>;
  data?: any;
}

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URI || '/api'; // /api should be fine when behind a reverse proxy

export default class ApiEndpoint {
  static getLoginPath = () => '/auth/login';
  static getProfilePath = () => '/auth/profile';
  static getLogoutPath = () => '/auth/logout';

  // static getRegisterPath = () => '/auth/register';
  // static getRefreshTokenPath = () => `/refresh`;

  static getUsersPath = () => '/users';
  static getTextSnippetsPath = () => '/text-snippet';

  /**
   * Make API payload
   * @param url
   * @param method
   * @param payload
   * @param contentType
   * @returns {{headers: {}, method: *}}
   */
  static makeApiPayload = (
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    payload: any = null,
    contentType: string | Record<string, unknown> | null = null,
    headers: any | null = null
  ): ApiPayload => {
    const jsonPayload: ApiPayload = {
      url: BASE_URL + url,
      method,
      withCredentials: true,
      headers: {},
    };
    // append custom headers (if available)
    if (headers !== null) {
      jsonPayload.headers = headers;
    }
    //console.log('using headers', jsonPayload.headers);
    if (!contentType) {
      jsonPayload.headers.Accept = 'application/json';
      jsonPayload.headers['Content-Type'] = 'application/json';
    } else {
      jsonPayload.headers['Content-Type'] = String(contentType);
    }
    //console.log('final headers', jsonPayload.headers);
    if (payload !== null) {
      const formData = new FormData();
      switch (jsonPayload.headers['Content-Type']) {
        case 'application/json':
          jsonPayload.data = payload;
          break;
        case 'multipart/form-data':
          // eslint-disable-next-line no-restricted-syntax
          for (const key of Object.keys(payload)) {
            formData.append(key, payload[key]);
          }
          //formData.append('file', payload);
          jsonPayload.data = formData;
          break;
        default:
          jsonPayload.data = null;
      }
    }
    return jsonPayload;
  };
}
