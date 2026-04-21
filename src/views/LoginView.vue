<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-icon">🔐</div>
        <h1>Bienvenido de nuevo</h1>
        <p class="auth-subtitle">Ingresa tus credenciales para continuar</p>
      </div>

      <form @submit.prevent="handleLogin" id="login-form">
        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
        </div>

        <div class="form-group">
          <label for="login-email">Email</label>
          <input 
            type="email" 
            id="login-email" 
            v-model="email" 
            required 
            placeholder="tu@correo.com"
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label for="login-password">Contraseña</label>
          <input 
            type="password" 
            id="login-password" 
            v-model="password" 
            required 
            placeholder="••••••••"
            autocomplete="current-password"
          />
        </div>

        <button type="submit" id="login-submit" :disabled="loading">
          <span v-if="loading" class="btn-spinner"></span>
          {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>¿No tienes cuenta? <RouterLink to="/register" class="auth-link">Crear una cuenta</RouterLink></p>
      </div>
    </div>
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
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px - 4rem);
  padding: 1rem;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  box-shadow: var(--shadow-lg);
  animation: cardEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

.auth-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.4rem;
  letter-spacing: -0.02em;
}

.auth-subtitle {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* Spinner for loading state */
.btn-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 0.5rem;
  vertical-align: middle;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.auth-footer {
  text-align: center;
  margin-top: 1.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-subtle);
}

.auth-footer p {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.auth-link {
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
  transition: color var(--transition-fast);
}

.auth-link:hover {
  color: var(--accent-hover);
  text-decoration: underline;
}
</style>
