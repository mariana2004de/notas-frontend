import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    error: null
  }),

  actions: {
    async login(email, password) {
      try {
        this.error = null
        const response = await api.post('/auth/login', { email, password })
        if (response.data.success) {
          this.token = response.data.data.token
          this.user = response.data.data.user
          
          localStorage.setItem('token', this.token)
          localStorage.setItem('user', JSON.stringify(this.user))
          return true
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al iniciar sesión'
        return false
      }
    },

    async register(name, email, password) {
      try {
        this.error = null
        const response = await api.post('/auth/register', { name, email, password })
        if (response.data.success) {
          return true
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al registrarse'
        return false
      }
    },

    async fetchProfile() {
      try {
        const response = await api.get('/auth/profile')
        if (response.data.success) {
          this.user = response.data.data
          localStorage.setItem('user', JSON.stringify(this.user))
          return this.user
        }
      } catch (err) {
        // If profile fails, token might be expired. Logout.
        this.logout()
        return null
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.error = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})
