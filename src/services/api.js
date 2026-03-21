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

export default api
