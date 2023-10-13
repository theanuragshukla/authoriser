import axios from 'axios';

const getClient = () => {
  const client = axios.create({
    baseURL: process.env.API_BASE_URL,
    withCredentials:true
  });
  return client
};

export default getClient();

