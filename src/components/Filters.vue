<template>
  <div class="filters-bar">
    <div class="filter-search">
      <span class="search-icon">🔍</span>
      <input 
        type="text" 
        id="search-input"
        v-model="localFilters.search" 
        placeholder="Buscar por título o contenido..." 
        @input="debouncedSearch"
      />
    </div>

    <div class="filter-selects">
      <div class="select-wrapper">
        <select id="filter-category" v-model="localFilters.category" @change="applyFilters">
          <option value="">Todas las categorías</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>

      <div class="select-wrapper">
        <select id="filter-status" v-model="localFilters.status" @change="applyFilters">
          <option value="">Cualquier estado</option>
          <option value="active">Activas</option>
          <option value="archived">Archivadas</option>
        </select>
      </div>
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
.filters-bar {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
  background: var(--bg-elevated);
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
}

/* Search */
.filter-search {
  flex: 1;
  position: relative;
  min-width: 0;
}

.search-icon {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  pointer-events: none;
}

.filter-search input {
  width: 100%;
  padding: 0.65rem 1rem 0.65rem 2.5rem;
  background: var(--bg-input);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-family: var(--font-family);
  font-size: 0.9rem;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  outline: none;
}

.filter-search input::placeholder {
  color: var(--text-muted);
}

.filter-search input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

/* Selects */
.filter-selects {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.select-wrapper select {
  appearance: none;
  padding: 0.65rem 2.2rem 0.65rem 0.9rem;
  background: var(--bg-input);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-family: var(--font-family);
  font-size: 0.85rem;
  cursor: pointer;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  outline: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239ca3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
}

.select-wrapper select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

/* Responsive */
@media (max-width: 768px) {
  .filters-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .filter-selects {
    flex-direction: column;
  }
  .select-wrapper select {
    width: 100%;
  }
}
</style>
