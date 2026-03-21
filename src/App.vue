<template>
  <header>
    <div class="wrapper">
      <nav v-if="authStore.token">
        <RouterLink to="/dashboard">Dashboard</RouterLink>
        <button @click="logout" class="btn-link">Cerrar Sesión</button>
      </nav>
      <nav v-else>
        <RouterLink to="/login">Iniciar Sesión</RouterLink>
        <RouterLink to="/register">Registrarse</RouterLink>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style>
header {
  line-height: 1.5;
  background: var(--color-background-soft);
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);
}

.wrapper {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

nav {
  display: flex;
  gap: 1rem;
  font-size: 1rem;
  align-items: center;
}

nav a.router-link-exact-active {
  color: var(--color-text);
  font-weight: bold;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  text-decoration: none;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

main {
  padding: 2rem;
  max-width: 1280px;
  margin: 0 auto;
}

.btn-link {
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  font-size: 1rem;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}
.btn-link:hover {
  text-decoration: underline;
}
</style>
