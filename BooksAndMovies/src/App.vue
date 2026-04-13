<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

const initialiserBase = async () => {
  try {
    await fetch('http://localhost:3000/api/import-auto');
    console.log("Système d'importation vérifié.");
  } catch (err) {
    console.error("Le serveur ne répond pas :", err);
  }
};
onMounted(() => {
  initialiserBase();
});
</script>

<style>
:root {
  --primary-green: #4caf50;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: sans-serif; background: #f1f8e9; }
</style>