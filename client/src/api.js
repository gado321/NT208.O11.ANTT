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
        
        const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('refresh_token')}` // Thêm JWT vào tiêu đề Authorization
            }
          };
          
          fetch('http://localhost:5000/auth/refresh', requestOptions)
            .then(response =>  {
              // Xử lý dữ liệu trả về từ phản hồi
              const data = response.json();
              console.log(data);
              localStorage.setItem('access_token', data.access_token);
              response.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
              return convertAxiosResponseToResponse(response);
            })
            .catch(error => {
              // Xử lý lỗi
              console.error('Lỗi khi gửi yêu cầu:', error);
            });
        // Retry the original request with the new token
        
        
      }
  
      return Promise.reject(error);
    }
  );
  
export default api
