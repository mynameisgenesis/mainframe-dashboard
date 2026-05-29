<script setup>
import { onMounted, ref } from "vue";

const apps = ref([]);

const form = ref({
  name: "",
  description: "",
  url: "",
  image_url: "",
  category: "General",
});

const API_URL = "/api/apps";

async function loadApps() {
  const response = await fetch(API_URL);
  apps.value = await response.json();
}

async function addApp() {
  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form.value),
  });

  form.value = {
    name: "",
    description: "",
    url: "",
    image_url: "",
    category: "General",
  };

  await loadApps();
}

async function deleteApp(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  await loadApps();
}

onMounted(loadApps);
</script>

<template>
  <main class="page">
    <section class="hero">
      <h1>Mainframe</h1>
      <p>Your home server app dashboard</p>
    </section>

    <section class="form-card">
      <h2>Add New App</h2>

      <form @submit.prevent="addApp">
        <input v-model="form.name" placeholder="App name" required />
        <input v-model="form.url" placeholder="App URL" required />
        <input v-model="form.image_url" placeholder="Image URL" />
        <input v-model="form.category" placeholder="Category" />
        <textarea
          v-model="form.description"
          placeholder="Description"
        ></textarea>

        <button type="submit">Add Tile</button>
      </form>
    </section>

    <section class="grid">
      <article v-for="app in apps" :key="app.id" class="tile">
        <img v-if="app.image_url" :src="app.image_url" :alt="app.name" />

        <div class="tile-body">
          <small>{{ app.category }}</small>
          <h2>{{ app.name }}</h2>
          <p>{{ app.description }}</p>

          <div class="actions">
            <a :href="app.url" target="_blank">Open</a>
            <button @click="deleteApp(app.id)">Delete</button>
          </div>
        </div>
      </article>
    </section>
  </main>
</template>

<style>
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: #111827;
  color: white;
}

.page {
  max-width: 1100px;
  margin: auto;
  padding: 32px;
}

.hero h1 {
  font-size: 48px;
  margin-bottom: 0;
}

.hero p {
  color: #9ca3af;
}

.form-card {
  background: #1f2937;
  padding: 24px;
  border-radius: 18px;
  margin: 32px 0;
}

form {
  display: grid;
  gap: 12px;
}

input,
textarea,
button {
  padding: 12px;
  border-radius: 10px;
  border: none;
  font-size: 16px;
}

button {
  cursor: pointer;
  background: #38bdf8;
  font-weight: bold;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
}

.tile {
  background: #1f2937;
  border-radius: 18px;
  overflow: hidden;
}

.tile img {
  width: 100%;
  height: 130px;
  object-fit: cover;
  background: #374151;
}

.tile-body {
  padding: 18px;
}

.tile small {
  color: #38bdf8;
}

.tile p {
  color: #d1d5db;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions a {
  color: #38bdf8;
  font-weight: bold;
  text-decoration: none;
}

.actions button {
  background: #ef4444;
  color: white;
}
</style>
