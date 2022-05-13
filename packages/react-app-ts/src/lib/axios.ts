import axios from "axios";

const instance = axios.create();

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject({ ...error, message: error.response.data });
  }
);

export default instance;
