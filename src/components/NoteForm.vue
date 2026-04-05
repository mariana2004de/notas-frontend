<template>
  <div class="note-form">
    <h3>{{ initialData ? 'Editar Nota' : 'Nueva Nota' }}</h3>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Título *</label>
        <input type="text" v-model="formData.title" required placeholder="Ej: Comprar víveres" />
      </div>

      <div class="form-group">
        <label>Contenido</label>
        <textarea v-model="formData.content" rows="4" placeholder="Escribe los detalles aquí..."></textarea>
      </div>

      <div class="form-row">
        <div class="form-group half">
          <label>Categoría</label>
          <input type="text" v-model="formData.category" placeholder="Ej: Trabajo, Personal" />
        </div>
        <div class="form-group half">
          <label>Estado</label>
          <select v-model="formData.status">
            <option value="active">Activa</option>
            <option value="archived">Archivada</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label>Etiquetas (separadas por coma)</label>
        <input type="text" v-model="tagsString" placeholder="Ej: urgente, hogar, finanzas" />
      </div>

      <div class="actions">
        <button type="button" class="btn-cancel" @click="$emit('cancel')">Cancelar</button>
        <button type="submit" class="btn-save" :disabled="loading">{{ loading ? 'Guardando...' : 'Guardar' }}</button>
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
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border: 1px solid var(--color-border);
  margin-bottom: 2rem;
}

h3 {
  margin-top: 0;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}
.half {
  flex: 1;
}

label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
}

input, textarea, select {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-family: inherit;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}
.btn-save {
  background: var(--color-primary);
  color: white;
}
.btn-cancel {
  background: #f1f3f4;
  color: #333;
}
</style>
