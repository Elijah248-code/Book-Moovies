<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>🎬 Inscription</h1>
        <p>Créez votre compte pour découvrir des films</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="username">Nom d'utilisateur</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            :disabled="loading"
            placeholder="Votre pseudo"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            :disabled="loading"
            placeholder="votre@email.com"
          />
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            :disabled="loading"
            placeholder="Au moins 6 caractères"
            minlength="6"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmer le mot de passe</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            :disabled="loading"
            placeholder="Répétez votre mot de passe"
          />
        </div>

        <button type="submit" :disabled="loading || !isFormValid" class="btn-primary">
          <span v-if="loading">Inscription...</span>
          <span v-else>Créer mon compte</span>
        </button>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="passwordError" class="error-message">
          {{ passwordError }}
        </div>
      </form>

      <div class="auth-footer">
        <p>Déjà un compte ?</p>
        <router-link to="/login" class="link-secondary">
          Se connecter
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { register } from '../services/api'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')

const passwordError = computed(() => {
  if (form.value.password && form.value.confirmPassword) {
    if (form.value.password !== form.value.confirmPassword) {
      return 'Les mots de passe ne correspondent pas'
    }
  }
  return ''
})

const isFormValid = computed(() => {
  return form.value.username && 
         form.value.email && 
         form.value.password.length >= 6 && 
         form.value.password === form.value.confirmPassword
})

const handleRegister = async () => {
  if (passwordError.value) return

  loading.value = true
  error.value = ''

  try {
    const response = await register({
      username: form.value.username,
      email: form.value.email,
      password: form.value.password
    })
    
    authStore.login(response.user, response.token)
    router.push('/')
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de l\'inscription'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #a8e6cf 0%, #dcedc8 100%);
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(76, 175, 80, 0.2);
  width: 100%;
  max-width: 400px;
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-header h1 {
  color: #4caf50;
  font-size: 2rem;
  margin-bottom: 10px;
  font-weight: 600;
}

.auth-header p {
  color: #666;
  font-size: 1rem;
}

.auth-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e8f5e8;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #f44336;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.auth-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e8f5e8;
}

.auth-footer p {
  color: #666;
  margin-bottom: 10px;
}

.link-secondary {
  color: #4caf50;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.link-secondary:hover {
  color: #388e3c;
  text-decoration: underline;
}
</style>