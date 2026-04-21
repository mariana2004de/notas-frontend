<template>
  <div class="note-form">
    <div class="form-header">
      <h3>{{ initialData ? '✏️ Editar Nota' : '✨ Nueva Nota' }}</h3>
      <button type="button" class="btn-close" @click="$emit('cancel')" id="form-close-btn">✕</button>
    </div>

    <form @submit.prevent="handleSubmit" id="note-form">
      <div class="form-group">
        <label for="note-title">Título <span class="required">*</span></label>
        <input 
          type="text" 
          id="note-title" 
          v-model="formData.title" 
          required 
          placeholder="Ej: Comprar víveres" 
        />
      </div>

      <div class="form-group">
        <label for="note-content">Contenido</label>
        <textarea 
          id="note-content" 
          v-model="formData.content" 
          rows="4" 
          placeholder="Escribe los detalles aquí..."
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group half">
          <label for="note-category">Categoría</label>
          <input 
            type="text" 
            id="note-category" 
            v-model="formData.category" 
            placeholder="Ej: Trabajo" 
          />
        </div>
        <div class="form-group half">
          <label for="note-status">Estado</label>
          <select id="note-status" v-model="formData.status">
            <option value="active">Activa</option>
            <option value="archived">Archivada</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="note-tags">Etiquetas <span class="hint">(separadas por coma)</span></label>
        <input 
          type="text" 
          id="note-tags" 
          v-model="tagsString" 
          placeholder="Ej: urgente, hogar, finanzas" 
        />
      </div>

      <div class="form-actions">
        <button type="button" class="btn-cancel" @click="$emit('cancel')">Cancelar</button>
        <button type="submit" class="btn-save" :disabled="loading" id="save-note-btn">
          <span v-if="loading" class="btn-spinner"></span>
          {{ loading ? 'Guardando...' : 'Guardar Nota' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useNotesStore } from '../stores/notes'

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['saved', 'cancel'])
const notesStore = useNotesStore()

const formData = ref({
  title: '',
  content: '',
  category: '',
  status: 'active'
})
const tagsString = ref('')
const loading = ref(false)

onMounted(() => {
  if (props.initialData) {
    formData.value = {
      title: props.initialData.title,
      content: props.initialData.content || '',
      category: props.initialData.category_name || '',
      status: props.initialData.status || 'active'
    }
    
    let tagsList = []
    try {
      tagsList = typeof props.initialData.tags === 'string' 
        ? JSON.parse(props.initialData.tags) 
        : (props.initialData.tags || [])
    } catch(e) {}
    
    tagsString.value = tagsList.map(t => t.name).join(', ')
  }
})

const handleSubmit = async () => {
  loading.value = true
  
  const payload = {
    ...formData.value,
    tags: tagsString.value ? tagsString.value.split(',').map(s => s.trim()).filter(s => s) : []
  }

  let success = false
  if (props.initialData && props.initialData.id) {
    success = await notesStore.updateNote(props.initialData.id, payload)
  } else {
    success = await notesStore.createNote(payload)
  }

  loading.value = false
  if (success) {
    emit('saved')
  } else {
    alert(notesStore.error)
  }
}
</script>

<style scoped>
.note-form {
  background: var(--bg-elevated);
  padding: 2rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-md);
  margin-bottom: 1.5rem;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.75rem;
}

.form-header h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.01em;
}

.btn-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-hover);
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all var(--transition-fast);
}

.btn-close:hover {
  background: var(--danger-soft);
  color: var(--danger);
}

/* Form fields inherit from main.css via .form-group */

.required {
  color: var(--danger);
}

.hint {
  font-weight: 400;
  color: var(--text-muted);
  font-size: 0.8rem;
}

textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-input);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-family: var(--font-family);
  font-size: 0.95rem;
  resize: vertical;
  min-height: 100px;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  outline: none;
}

textarea::placeholder {
  color: var(--text-muted);
}

textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239ca3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.half {
  flex: 1;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-subtle);
}

.btn-cancel,
.btn-save {
  padding: 0.65rem 1.5rem;
  border: none;
  border-radius: var(--radius-sm);
  font-family: var(--font-family);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.btn-cancel {
  background: var(--bg-hover);
  color: var(--text-secondary);
}

.btn-cancel:hover {
  background: var(--bg-input);
  color: var(--text-primary);
}

.btn-save {
  background: var(--accent);
  color: #fff;
}

.btn-save:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-glow);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .note-form {
    padding: 1.25rem;
  }
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>
