import axios from 'axios';
const backendUrl = process.env.REACT_APP_BACKEND_URL|| 'http://localhost:5000/queryapi/'
const axiosInstance = axios.create({
    baseURL:backendUrl,
 headers: {
    'Content-Type': 'application/json',
    
  },
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data &&
      (error.response.data.error === 'Token expired' || error.response.data.error === 'Invalid token' || error.response.data.error === 'Unauthorized')
    ) {
      // Remove token and redirect to login
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userrole');
      localStorage.removeItem('userInitial');
      localStorage.removeItem('username');
      window.location.href = '/query-ui';
    }
  });
export default axiosInstance;
