import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Ajusta según el puerto del backend
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptores para adjuntar Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor de respuesta — manejo global de errores 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Solo redirigir si no estamos ya en login/register
      const path = window.location.pathname
      if (path !== '/login' && path !== '/register') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
