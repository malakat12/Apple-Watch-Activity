import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const axiosInst = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, 
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

axiosInst.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInst.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
    }
    
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject({
        response: {
          data: { message: 'Network Error. Please check your connection.' }
        }
      });
    }
    
    switch (error.response.status) {
      case 401:
        break;
      case 403:
        console.error('Forbidden:', error.response.data);
        break;
      case 500:
        console.error('Server Error:', error.response.data);
        break;
    }
    
    return Promise.reject(error);
  }
);

axiosInst.defaults.onUploadProgress = (progressEvent) => {
  const percentCompleted = Math.round(
    (progressEvent.loaded * 100) / progressEvent.total
  );
};
export default axiosInst;
