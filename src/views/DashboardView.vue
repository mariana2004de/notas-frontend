<template>
  <div class="dashboard-view">
    <h2>Dashboard Privado</h2>
    
    <div v-if="loading" class="loading">
      Cargando perfil...
    </div>
    
    <div v-else-if="userProfile" class="profile-card">
      <p><strong>ID:</strong> {{ userProfile.id }}</p>
      <p><strong>Nombre:</strong> {{ userProfile.name }}</p>
      <p><strong>Email:</strong> {{ userProfile.email }}</p>
      <p><strong>Rol:</strong> <span class="badge">{{ userProfile.role }}</span></p>
      <p><strong>Miembro desde:</strong> {{ new Date(userProfile.created_at).toLocaleDateString() }}</p>
    </div>

    <div v-else class="error-message">
      No se pudo cargar el perfil
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const userProfile = ref(null)
const loading = ref(true)

onMounted(async () => {
  const profile = await authStore.fetchProfile()
  if (profile) {
    userProfile.value = profile
  } else {
    // Si falla cargar perfil, el token podría estar inactivo, regresar a login
    router.push('/login')
  }
  loading.value = false
})
</script>

<style scoped>
.dashboard-view {
  max-width: 600px;
  margin: 0 auto;
}

h2 {
  margin-top: 0;
}

.profile-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 1.5rem;
}

.profile-card p {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.badge {
  background: var(--color-primary);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.loading {
  text-align: center;
  color: var(--color-text);
  font-style: italic;
  margin-top: 2rem;
}
</style>
