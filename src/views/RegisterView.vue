<template>
  <div class="register-view">
    <h2>Registrarse</h2>
    <form @submit.prevent="handleRegister">
      <div v-if="authStore.error" class="error-message">
        {{ authStore.error }}
      </div>
      
      <div class="form-group">
        <label for="name">Nombre</label>
        <input type="text" id="name" v-model="name" required />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input type="password" id="password" v-model="password" minlength="6" required />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Cargando...' : 'Crear Cuenta' }}
      </button>
    </form>
    <p>¿Ya tienes cuenta? <RouterLink to="/login">Inicia Sesión</RouterLink></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)

const handleRegister = async () => {
  loading.value = true
  const success = await authStore.register(name.value, email.value, password.value)
  loading.value = false
  
  if (success) {
    alert('Registro exitoso. Ahora puedes iniciar sesión.')
    router.push('/login')
  }
}
</script>

<style scoped>
.register-view {
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
