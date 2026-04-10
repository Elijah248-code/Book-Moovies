<template>
  <div class="home-container">
    <!-- Header avec navigation -->
    <header class="app-header">
      <div class="header-content">
        <h1 class="logo">🎬 Movies App</h1>
        <nav class="nav-menu">
          <router-link to="/" class="nav-link active">Films</router-link>
          <router-link to="/profile" class="nav-link">Profil</router-link>
          <button @click="handleLogout" class="btn-logout">
            Déconnexion
          </button>
        </nav>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="main-content">
      <div class="content-header">
        <h2>Ma Liste de Films</h2>
        <p class="compteur" v-if="!loading && !error">
          {{ films.length }} film(s) trouvé(s)
        </p>
      </div>

      <!-- États de chargement -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Chargement des films...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>Oups ! Une erreur est survenue</h3>
        <p>{{ error }}</p>
        <button @click="loadFilms" class="btn-retry">
          Réessayer
        </button>
      </div>

      <div v-else-if="films.length === 0" class="empty-state">
        <div class="empty-icon">🎭</div>
        <h3>Aucun film trouvé</h3>
        <p>La liste des films est vide pour le moment.</p>
      </div>

      <!-- Grille des films -->
      <div v-else class="films-grid">
        <div v-for="film in films" :key="film.id" class="film-card">
          <div class="film-badge">{{ film.Categorie }}</div>
          <div class="film-content">
            <h3 class="film-title">{{ film.Titre }}</h3>
            <div class="film-info">
              <p><strong>Réalisateur:</strong> {{ film.Realisateur }}</p>
              <p><strong>Acteurs:</strong> {{ film.Acteur }}</p>
              <div class="film-rating">
                <span class="rating-stars">
                  {{ '★'.repeat(Math.floor(film.Note)) }}{{ '☆'.repeat(5 - Math.floor(film.Note)) }}
                </span>
                <span class="rating-text">{{ film.Note }}/10</span>
              </div>
              <p class="rating-count">{{ film.Nombre_note }} votes</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { getFilms } from '../services/api'

const router = useRouter()
const authStore = useAuthStore()

const films = ref<any[]>([])
const error = ref<string>('')
const loading = ref<boolean>(false)

const loadFilms = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const data = await getFilms()
    films.value = data
  } catch (err: any) {
    error.value = err.message || 'Erreur de connexion au serveur.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  loadFilms()
})
</script>

<style scoped>
.home-container {
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.content-header {
  text-align: center;
  margin-bottom: 40px;
}

.content-header h2 {
  color: #2e7d32;
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 600;
}

.compteur {
  color: #666;
  font-size: 1.1rem;
  font-style: italic;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e8f5e8;
  border-top: 4px solid #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon,
.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.error-state h3,
.empty-state h3 {
  color: #333;
  margin-bottom: 10px;
}

.error-state p,
.empty-state p {
  color: #666;
  margin-bottom: 20px;
}

.btn-retry {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
}

.films-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

.film-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e8f5e8;
  position: relative;
  overflow: hidden;
}

.film-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(76, 175, 80, 0.2);
}

.film-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.film-content {
  margin-top: 10px;
}

.film-title {
  color: #2e7d32;
  font-size: 1.3rem;
  margin-bottom: 15px;
  font-weight: 600;
  line-height: 1.3;
}

.film-info p {
  margin: 8px 0;
  color: #555;
  font-size: 0.95rem;
}

.film-rating {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px 0;
}

.rating-stars {
  color: #ffc107;
  font-size: 1.2rem;
}

.rating-text {
  background: #f1f8e9;
  color: #2e7d32;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
}

.rating-count {
  color: #888;
  font-size: 0.85rem;
  font-style: italic;
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

  .content-header h2 {
    font-size: 2rem;
  }

  .films-grid {
    grid-template-columns: 1fr;
  }

  .film-card {
    padding: 20px;
  }
}
</style>