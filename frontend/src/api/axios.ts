import axios from 'axios';
export {AxiosError} from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1/', // Your Django API root
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});



// Add an Interceptor to include the Token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response, // If the request succeeds, just return the response
  async (error) => {
    const originalRequest = error.config;

    // 1. Check if the error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark to prevent infinite loops

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        // 2. Request a new access token from Django
        const res = await axios.post('auth/token/refresh/', {
          refresh: refreshToken,
        });

        if (res.status === 200) {
          const newAccessToken = res.data.access;
          
          // 3. Store the new token
          localStorage.setItem('access_token', newAccessToken);

          // 4. Update the header and retry the original failed request
          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        // 5. If refresh fails (token expired), log the user out
        console.error("Refresh token expired. Logging out...");
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
api.defaults.xsrfCookieName = 'csrftoken';
api.defaults.xsrfHeaderName = 'X-CSRFToken';
api.defaults.withCredentials = true;

export default api;