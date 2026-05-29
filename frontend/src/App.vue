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
      <article
        v-for="app in apps"
        @click="window.open(app.url, '_blank')"
        :key="app.id"
        class="tile"
        :style="{
          backgroundImage: app.image_url
            ? `linear-gradient(to top, rgba(0,0,0,.75), rgba(0,0,0,.15)), url('${app.image_url}')`
            : 'linear-gradient(135deg, #1f2937, #111827)',
        }"
      >
        <div class="tile-overlay">
          <small>{{ app.category }}</small>
          <h2>{{ app.name }}</h2>
          <p>{{ app.description }}</p>

          <div class="actions">
            <a :href="app.url" target="_blank" @click.stop>Open</a>
            <button @click.stop="deleteApp(app.id)">Delete</button>
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
  position: relative;
  min-height: 240px;
  border-radius: 22px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
  transform: translateY(0);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.tile::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.85),
    rgba(0, 0, 0, 0.25),
    rgba(0, 0, 0, 0.05)
  );
  opacity: 0.65;
  transition: opacity 0.2s ease;
}

.tile:hover {
  transform: translateY(-6px);
  box-shadow: 0 26px 60px rgba(0, 0, 0, 0.5);
}

.tile:hover::before {
  opacity: 0.9;
}

.tile-overlay {
  position: absolute;
  inset: 0;
  padding: 22px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  opacity: 0;
  transform: translateY(14px);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.tile:hover .tile-overlay {
  opacity: 1;
  transform: translateY(0);
}

.tile small {
  color: #38bdf8;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.tile h2 {
  margin: 8px 0 4px;
  font-size: 24px;
}

.tile p {
  color: #e5e7eb;
  margin: 0 0 16px;
}

.actions {
  display: flex;
  gap: 10px;
}

.actions a,
.actions button {
  padding: 10px 14px;
  border-radius: 999px;
  border: none;
  font-weight: 700;
  font-size: 14px;
}

.actions a {
  color: #111827;
  background: white;
  text-decoration: none;
}

.actions button {
  background: rgba(239, 68, 68, 0.9);
  color: white;
}
</style>
