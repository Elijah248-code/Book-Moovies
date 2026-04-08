<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMessage } from './services/api'

const message = ref<string>('')
const error = ref<string>('')
const loading = ref<boolean>(false)

onMounted(async () => {
  loading.value = true
  try {
    const data = await getMessage()
    message.value = data.message
  } catch (err) {
    error.value = 'Erreur de connexion au serveur'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <h1>Book and Moovies xD</h1>
    <div v-if="loading">Chargement...</div>
    <div v-if="error" style="color: red">{{ error }}</div>
    <div v-if="message" style="color: green">{{ message }}</div>
  </div>
</template>

<style scoped></style>
