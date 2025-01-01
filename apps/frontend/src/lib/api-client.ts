import { UserLoginDtoType } from '@repo/shared';
import axios from 'axios';

const buildBackendUrl = (endpoint: string): string => {
  let baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    baseUrl = 'http://localhost:7777/api/';
    console.info('API_BASE_URL env variable was undefined. Using ', baseUrl);
  }
  return baseUrl + endpoint;
};

export const postLogin = async (data: UserLoginDtoType) => {
  const response = await axios.post(buildBackendUrl('auth/login'), data);
  console.log('postLogin response', response);
  return response;
};
