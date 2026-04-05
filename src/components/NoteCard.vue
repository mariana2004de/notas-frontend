<template>
  <div class="note-card">
    <div class="note-header">
      <h3>{{ note.title }}</h3>
      <span :class="['status-badge', note.status]">{{ note.status }}</span>
    </div>
    <div class="note-meta">
      <span v-if="note.category_name" class="category">📁 {{ note.category_name }}</span>
      <span class="date">📅 {{ new Date(note.created_at).toLocaleDateString() }}</span>
    </div>
    
    <p class="content">{{ note.content }}</p>

    <div class="note-tags" v-if="tags.length > 0">
      <span v-for="tag in tags" :key="tag.id" class="tag">#{{ tag.name }}</span>
    </div>

    <div class="actions">
      <button class="btn-edit" @click="$emit('edit', note)">Editar</button>
      <button class="btn-delete" @click="handleDelete">Eliminar</button>
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
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.2s;
  border: 1px solid var(--color-border);
}
.note-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.note-header h3 {
  margin: 0;
  color: var(--color-primary);
  font-size: 1.25rem;
}
.status-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  text-transform: uppercase;
  font-weight: bold;
}
.status-badge.active { background: #e6f4ea; color: #1e8e3e; }
.status-badge.archived { background: #f1f3f4; color: #5f6368; }

.note-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #666;
}

.content {
  margin: 0;
  color: var(--color-text);
  line-height: 1.5;
  white-space: pre-wrap;
  flex-grow: 1;
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.tag {
  background: #f1f3f4;
  color: #5f6368;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: auto;
}
button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}
.btn-edit {
  background: var(--color-primary);
  color: white;
}
.btn-delete {
  background: #fce8e6;
  color: var(--color-error);
}
.btn-delete:hover {
  background: #fad2cf;
}
</style>
