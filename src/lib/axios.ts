import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor: Add accessToken to every request
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    return response
  }
  // (error) => {
  //   if (error.response?.status === 401) {
  //     // Clear cookies and redirect to login
  //     Cookies.remove('accessToken')
  //     Cookies.remove('refreshToken')
  //     Cookies.remove('user')
  //     // Redirect to login page
  //     if (typeof window !== 'undefined') {
  //       window.location.href = '/login'
  //     }
  //   }
  //   return Promise.reject(error)
  // }
)

export default api
