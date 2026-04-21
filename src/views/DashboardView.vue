<template>
  <div class="dashboard">
    <!-- Header Section -->
    <header class="dash-header">
      <div class="dash-welcome" v-if="!loading">
        <div v-if="userProfile" class="welcome-content">
          <div class="avatar">{{ userProfile.name?.charAt(0)?.toUpperCase() }}</div>
          <div class="welcome-text">
            <h1>Hola, {{ userProfile.name }} 👋</h1>
            <p class="welcome-sub">Tienes <strong>{{ notesStore.notes.length }}</strong> notas en total</p>
          </div>
          <span class="role-badge">{{ userProfile.role }}</span>
        </div>
      </div>
      <div v-else class="loading-skeleton">
        <div class="skeleton-circle"></div>
        <div class="skeleton-lines">
          <div class="skeleton-line w-40"></div>
          <div class="skeleton-line w-24"></div>
        </div>
      </div>

      <button 
        @click="showForm = true" 
        class="btn-new-note" 
        v-if="!showForm"
        id="create-note-btn"
      >
        <span class="btn-icon">+</span>
        Nueva Nota
      </button>
    </header>

    <!-- Form Section -->
    <transition name="slide-fade">
      <div v-if="showForm" class="form-wrapper">
        <NoteForm 
          :initialData="selectedNote"
          @saved="handleSaved"
          @cancel="handleCancel"
        />
      </div>
    </transition>

    <!-- Filters -->
    <Filters />

    <!-- Notes Grid -->
    <div class="notes-grid" v-if="!notesStore.loading && notesStore.notes.length > 0">
      <NoteCard 
        v-for="(note, index) in notesStore.notes" 
        :key="note.id" 
        :note="note" 
        :style="{ animationDelay: `${index * 0.05}s` }"
        @edit="handleEdit"
      />
    </div>
    
    <!-- Loading State -->
    <div v-else-if="notesStore.loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Cargando tus notas...</p>
    </div>
    
    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">📝</div>
      <h3>No hay notas aún</h3>
      <p>Crea tu primera nota para empezar a organizar tus ideas.</p>
      <button @click="showForm = true" class="btn-empty-create" v-if="!showForm">
        + Crear primera nota
      </button>
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
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

/* --- Header --- */
.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: var(--bg-elevated);
  padding: 1.5rem 2rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-sm);
}

.welcome-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--accent), #a78bfa);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.welcome-text h1 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin: 0;
}

.welcome-sub {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.15rem;
}

.welcome-sub strong {
  color: var(--accent);
  font-weight: 600;
}

.role-badge {
  background: var(--accent-soft);
  color: var(--accent);
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* --- Skeleton Loader --- */
.loading-skeleton {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.skeleton-circle {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--bg-hover);
  animation: pulse 1.5s infinite;
}

.skeleton-lines {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: var(--bg-hover);
  animation: pulse 1.5s infinite;
}

.w-40 { width: 160px; }
.w-24 { width: 96px; }

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

/* --- New Note Button --- */
.btn-new-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.5rem;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-full);
  font-family: var(--font-family);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.btn-new-note:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.btn-icon {
  font-size: 1.2rem;
  line-height: 1;
}

/* --- Form Transition --- */
.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-16px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.form-wrapper {
  margin-bottom: 1.5rem;
}

/* --- Notes Grid --- */
.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

/* --- Loading State --- */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
}

.loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--border-default);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* --- Empty State --- */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-elevated);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--border-default);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.empty-state h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.btn-empty-create {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.5rem;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-full);
  font-family: var(--font-family);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-empty-create:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

/* --- Responsive --- */
@media (max-width: 640px) {
  .dash-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
    padding: 1.25rem;
  }
  .notes-grid {
    grid-template-columns: 1fr;
  }
  .welcome-text h1 {
    font-size: 1.1rem;
  }
}
</style>
