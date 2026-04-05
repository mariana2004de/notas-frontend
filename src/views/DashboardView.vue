<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div v-if="loading" class="loading">Cargando perfil...</div>
      <div v-else-if="userProfile" class="profile-info">
        <h2>Hola, {{ userProfile.name }} 👋</h2>
        <span class="badge">{{ userProfile.role }}</span>
      </div>
      <button @click="showForm = true" class="btn-create" v-if="!showForm">+ Nueva Nota</button>
    </header>

    <div v-if="showForm" class="form-container">
      <NoteForm 
        :initialData="selectedNote"
        @saved="handleSaved"
        @cancel="handleCancel"
      />
    </div>

    <Filters />

    <div class="notes-grid" v-if="!notesStore.loading && notesStore.notes.length > 0">
      <NoteCard 
        v-for="note in notesStore.notes" 
        :key="note.id" 
        :note="note" 
        @edit="handleEdit"
      />
    </div>
    
    <div v-else-if="notesStore.loading" class="loading">
      Cargando notas...
    </div>
    
    <div v-else class="empty-state">
      No se encontraron notas que coincidan con la búsqueda.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useNotesStore } from '../stores/notes'

import NoteForm from '../components/NoteForm.vue'
import NoteCard from '../components/NoteCard.vue'
import Filters from '../components/Filters.vue'

const authStore = useAuthStore()
const notesStore = useNotesStore()
const router = useRouter()

const userProfile = ref(null)
const loading = ref(true)

const showForm = ref(false)
const selectedNote = ref(null)

onMounted(async () => {
  const profile = await authStore.fetchProfile()
  if (profile) {
    userProfile.value = profile
    await notesStore.fetchNotes()
  } else {
    router.push('/login')
  }
  loading.value = false
})

const handleEdit = (note) => {
  selectedNote.value = note
  showForm.value = true
}

const handleCancel = () => {
  showForm.value = false
  selectedNote.value = null
}

const handleSaved = () => {
  showForm.value = false
  selectedNote.value = null
}
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border: 1px solid var(--color-border);
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.profile-info h2 {
  margin: 0;
  color: var(--color-primary);
}

.badge {
  background: var(--color-primary);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.btn-create {
  background: #198754;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-create:hover {
  background: #157347;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  color: #6c757d;
  font-style: italic;
  border: 1px dashed var(--color-border);
}

.loading {
  text-align: center;
  color: var(--color-text);
  font-style: italic;
}

.form-container {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
