<template>
  <div class="login-view">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin">
      <div v-if="authStore.error" class="error-message">
        {{ authStore.error }}
      </div>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input type="password" id="password" v-model="password" required />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Cargando...' : 'Entrar' }}
      </button>
    </form>
    <p>¿No tienes cuenta? <RouterLink to="/register">Regístrate</RouterLink></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  const success = await authStore.login(email.value, password.value)
  loading.value = false
  
  if (success) {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.login-view {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}
p {
  margin-top: 1rem;
  text-align: center;
}
</style>
