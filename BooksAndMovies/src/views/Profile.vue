<template>
  <div class="profile-container">
    <!-- Header avec navigation -->
    <header class="app-header">
      <div class="header-content">
        <h1 class="logo">🎬 Movies App</h1>
        <nav class="nav-menu">
          <router-link to="/" class="nav-link">Films</router-link>
          <router-link to="/profile" class="nav-link active">Profil</router-link>
          <button @click="handleLogout" class="btn-logout">
            Déconnexion
          </button>
        </nav>
      </div>
    </header>

    <!-- Contenu du profil -->
    <main class="main-content">
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar">
            {{ user?.username?.charAt(0).toUpperCase() }}
          </div>
          <div class="profile-info">
            <h2>{{ user?.username }}</h2>
            <p class="email">{{ user?.email }}</p>
            <div class="member-since">
              <span class="badge">Membre depuis 2026</span>
            </div>
          </div>
        </div>

        <div class="profile-stats">
          <div class="stat-card">
            <div class="stat-number">0</div>
            <div class="stat-label">Films notés</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">0</div>
            <div class="stat-label">Commentaires</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">4.2</div>
            <div class="stat-label">Note moyenne</div>
          </div>
        </div>

        <div class="profile-actions">
          <button class="btn-primary">
            Modifier le profil
          </button>
          <button class="btn-secondary">
            Mes notations
          </button>
        </div>
      </div>

      <!-- Section des films récents -->
      <div class="recent-section">
        <h3>Films récemment notés</h3>
        <div class="empty-recent">
          <div class="empty-icon">🎭</div>
          <p>Vous n'avez pas encore noté de films</p>
          <router-link to="/" class="btn-primary">
            Découvrir des films
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f1f8e9 0%, #e8f5e8 100%);
}

.app-header {
  background: white;
  box-shadow: 0 2px 10px rgba(76, 175, 80, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.logo {
  color: #4caf50;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
  color: #4caf50;
  background: #f1f8e9;
}

.btn-logout {
  background: linear-gradient(135deg, #ff7043, #ff5722);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 87, 34, 0.3);
}

.main-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.profile-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(76, 175, 80, 0.1);
  margin-bottom: 30px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e8f5e8;
}

.avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  flex-shrink: 0;
}

.profile-info h2 {
  color: #2e7d32;
  font-size: 1.8rem;
  margin-bottom: 5px;
  font-weight: 600;
}

.email {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.badge {
  background: #f1f8e9;
  color: #2e7d32;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 600;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  text-align: center;
  padding: 20px;
  background: #f8fffe;
  border-radius: 15px;
  border: 1px solid #e8f5e8;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #4caf50;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
}

.profile-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  color: white;
  border: none;
}

.btn-secondary {
  background: white;
  color: #4caf50;
  border: 2px solid #4caf50;
}

.btn-primary:hover,
.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
}

.recent-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.1);
}

.recent-section h3 {
  color: #2e7d32;
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-weight: 600;
}

.empty-recent {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.empty-recent p {
  color: #666;
  margin-bottom: 20px;
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    height: auto;
    padding: 15px 20px;
    gap: 15px;
  }

  .nav-menu {
    flex-wrap: wrap;
    justify-content: center;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .profile-actions {
    flex-direction: column;
  }

  .profile-stats {
    grid-template-columns: 1fr;
  }
}
</style>