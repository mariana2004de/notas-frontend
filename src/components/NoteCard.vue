<template>
  <div class="note-card">
    <div class="card-top">
      <div class="card-header">
        <h3 class="card-title">{{ note.title }}</h3>
        <span :class="['status-chip', note.status]">{{ note.status === 'active' ? 'Activa' : 'Archivada' }}</span>
      </div>

      <div class="card-meta">
        <span v-if="note.category_name" class="meta-item category-chip">
          {{ note.category_name }}
        </span>
        <span class="meta-item">
          {{ new Date(note.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) }}
        </span>
      </div>

      <p class="card-content" v-if="note.content">{{ note.content }}</p>

      <div class="card-tags" v-if="tags.length > 0">
        <span v-for="tag in tags" :key="tag.id" class="tag-chip">#{{ tag.name }}</span>
      </div>
    </div>

    <div class="card-actions">
      <button class="action-btn action-edit" @click="$emit('edit', note)" id="edit-note-btn">
        ✏️ Editar
      </button>
      <button class="action-btn action-delete" @click="handleDelete" id="delete-note-btn">
        🗑️ Eliminar
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNotesStore } from '../stores/notes'

const props = defineProps({
  note: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit'])
const notesStore = useNotesStore()

const tags = computed(() => {
  return typeof props.note.tags === 'string' ? JSON.parse(props.note.tags) : (props.note.tags || [])
})

const handleDelete = async () => {
  if (confirm('¿Estás seguro de querer eliminar esta nota?')) {
    await notesStore.deleteNote(props.note.id)
  }
}
</script>

<style scoped>
.note-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base);
  animation: cardAppear 0.4s cubic-bezier(0.16, 1, 0.3, 1) backwards;
  position: relative;
  overflow: hidden;
}

.note-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent), #a78bfa, #ec4899);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.note-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-default);
}

.note-card:hover::before {
  opacity: 1;
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-top {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
}

.card-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.4;
  letter-spacing: -0.01em;
}

.status-chip {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
  flex-shrink: 0;
}

.status-chip.active {
  background: var(--success-soft);
  color: var(--success);
}

.status-chip.archived {
  background: var(--bg-hover);
  color: var(--text-muted);
}

/* Meta */
.card-meta {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.category-chip {
  background: var(--info-soft);
  color: var(--info);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-full);
  font-weight: 500;
}

/* Content */
.card-content {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
  white-space: pre-wrap;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Tags */
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tag-chip {
  background: var(--accent-soft);
  color: var(--accent);
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
}

/* Actions */
.card-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-subtle);
}

.action-btn {
  padding: 0.45rem 0.9rem;
  border: none;
  border-radius: var(--radius-sm);
  font-family: var(--font-family);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.action-edit {
  background: var(--accent-soft);
  color: var(--accent);
}

.action-edit:hover {
  background: var(--accent);
  color: #fff;
}

.action-delete {
  background: var(--danger-soft);
  color: var(--danger);
}

.action-delete:hover {
  background: var(--danger);
  color: #fff;
}
</style>
