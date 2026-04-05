<template>
  <div class="filters">
    <div class="filter-group col-span-2">
      <input 
        type="text" 
        v-model="localFilters.search" 
        placeholder="🔍 Buscar por título o contenido..." 
        @input="debouncedSearch"
      />
    </div>

    <div class="filter-group">
      <select v-model="localFilters.category" @change="applyFilters">
        <option value="">Todas las Categorías</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <div class="filter-group">
      <select v-model="localFilters.status" @change="applyFilters">
        <option value="">Cualquier Estado</option>
        <option value="active">Activas</option>
        <option value="archived">Archivadas</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useNotesStore } from '../stores/notes'

const notesStore = useNotesStore()

const localFilters = ref({ ...notesStore.filters })

// Obtenemos categorias unicas de las notas cargadas (si queremos todas las creadas, podríamos pedir del backend, pero esto sirve para la vista).
const categories = computed(() => {
  const cats = new Set(notesStore.notes.map(n => n.category_name).filter(Boolean))
  return Array.from(cats)
})

let timer = null
const debouncedSearch = () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    applyFilters()
  }, 300)
}

const applyFilters = () => {
  notesStore.setFilters(localFilters.value)
}
</script>

<style scoped>
.filters {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border: 1px solid var(--color-border);
}

.filter-group input, 
.filter-group select {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
}
.col-span-2 {
  grid-column: span 2;
}

@media (max-width: 768px) {
  .filters {
    grid-template-columns: 1fr;
  }
  .col-span-2 {
    grid-column: span 1;
  }
}
</style>
