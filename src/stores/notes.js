import { defineStore } from 'pinia'
import api from '../services/api'

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [],
    loading: false,
    error: null,
    filters: {
      search: '',
      category: '',
      status: ''
    }
  }),

  actions: {
    async fetchNotes() {
      this.loading = true
      this.error = null
      try {
        const { search, category, status } = this.filters
        let url = '/notes?'
        if (search) url += `search=${search}&`
        if (category) url += `category=${category}&`
        if (status) url += `status=${status}&`

        const response = await api.get(url)
        if (response.data.success) {
          this.notes = response.data.data
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al obtener notas'
      } finally {
        this.loading = false
      }
    },

    async createNote(noteData) {
      try {
        const response = await api.post('/notes', noteData)
        if (response.data.success) {
          await this.fetchNotes() // refresh list
          return true
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al crear nota'
        return false
      }
    },

    async updateNote(id, noteData) {
      try {
        const response = await api.put(`/notes/${id}`, noteData)
        if (response.data.success) {
          await this.fetchNotes()
          return true
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al actualizar nota'
        return false
      }
    },

    async deleteNote(id) {
      try {
        const response = await api.delete(`/notes/${id}`)
        if (response.data.success) {
          await this.fetchNotes()
          return true
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al eliminar nota'
        return false
      }
    },

    setFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
      this.fetchNotes()
    }
  }
})
