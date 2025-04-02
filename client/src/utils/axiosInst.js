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
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const { data } = await axios.post(`${API_BASE_URL}/oauth/token`, {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: process.env.REACT_APP_CLIENT_ID,
            client_secret: process.env.REACT_APP_CLIENT_SECRET,
          });
          
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return axiosInst(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; 
      }
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
