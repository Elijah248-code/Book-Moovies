<template>
  <router-view />
</template>

<script setup lang="ts">
// Le router gère maintenant toute la navigation
</script>

<style>
/* Styles globaux */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f1f8e9;
  color: #333;
  line-height: 1.6;
}

/* Variables CSS pour le thème vert */
:root {
  --primary-green: #4caf50;
  --light-green: #81c784;
  --dark-green: #388e3c;
  --accent-green: #8bc34a;
  --background-light: #f1f8e9;
  --text-dark: #1b5e20;
  --white: #ffffff;
  --gray-light: #e8f5e8;
  --error: #f44336;
  --warning: #ff9800;
  --success: #4caf50;
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--gray-light);
}

::-webkit-scrollbar-thumb {
  background: var(--primary-green);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--dark-green);
}
</style>