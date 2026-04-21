<template>
  <div class="app-shell">
    <header class="app-navbar">
      <div class="navbar-inner">
        <div class="navbar-brand">
          <span class="brand-icon">📝</span>
          <span class="brand-text">NotasApp</span>
        </div>
        <nav v-if="authStore.token" class="navbar-nav">
          <RouterLink to="/dashboard" class="nav-link" active-class="nav-link--active">
            <span class="nav-icon">📊</span>
            Dashboard
          </RouterLink>
          <button @click="logout" class="nav-logout" id="logout-btn">
            <span class="nav-icon">🚪</span>
            Salir
          </button>
        </nav>
        <nav v-else class="navbar-nav">
          <RouterLink to="/login" class="nav-link" active-class="nav-link--active">Iniciar Sesión</RouterLink>
          <RouterLink to="/register" class="nav-btn-register">Crear Cuenta</RouterLink>
        </nav>
      </div>
    </header>

    <main class="app-main">
      <RouterView v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
  </div>
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
/* --- App Shell --- */
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* --- Navbar --- */
.app-navbar {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-subtle);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.navbar-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
}

.brand-icon {
  font-size: 1.4rem;
}

.brand-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), background var(--transition-fast);
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.nav-link--active {
  color: var(--accent) !important;
  background: var(--accent-soft) !important;
}

.nav-icon {
  font-size: 1rem;
}

.nav-logout {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  color: var(--text-secondary);
  background: none;
  border: none;
  font-family: var(--font-family);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), background var(--transition-fast);
}

.nav-logout:hover {
  color: var(--danger);
  background: var(--danger-soft);
}

.nav-btn-register {
  padding: 0.5rem 1.2rem;
  background: var(--accent);
  color: #fff !important;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: var(--radius-full);
  transition: background var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
}

.nav-btn-register:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-glow);
}

/* --- Main Content --- */
.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
}

/* --- Page Transition --- */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* --- Responsive --- */
@media (max-width: 640px) {
  .navbar-inner {
    padding: 0 1rem;
  }
  .app-main {
    padding: 1.25rem;
  }
  .brand-text {
    font-size: 1rem;
  }
}
</style>
