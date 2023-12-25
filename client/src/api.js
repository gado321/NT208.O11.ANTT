import axios from 'axios';

function convertAxiosResponseToResponse(axiosResponse) {
  const { data, status, statusText, headers, config, request } = axiosResponse;

  // Create a new Response object
  const response = new Response(JSON.stringify(data), {
    status,
    statusText,
    headers,
  });

  return response;
}

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

// Add a request interceptor
api.interceptors.request.use(
  async (config) => {
    const auth_token = localStorage.getItem('access_token');
    if (auth_token) {
      config.headers.Authorization = `Bearer ${auth_token}`;
    }
    return config;
  }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => convertAxiosResponseToResponse(response),
    async (error) => {
      const originalRequest = error.config;
  
      // If the error status is 401 and there is no originalRequest._retry flag,
      // it means the token has expired and we need to refresh it
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refresh_token = localStorage.getItem('refresh_token');
        const refreshResponse = await axios.post('http://localhost:5000/auth/refresh',null, {
          headers: {
            'Authorization': `Bearer ${refresh_token}`
          }
        });

          // Get the new access token from the refresh response
          const newAccessToken = refreshResponse.data.access_token;

          // Update the access token in localStorage
          localStorage.setItem('access_token', newAccessToken);

          // Update the Authorization header with the new access token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Retry the original request with the updated token
          const reg = axios(originalRequest);
          return reg;
        
      }
  
      return Promise.reject(error);
    }
  );
  
export default api
