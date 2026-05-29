const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const db = new Database("./data/dashboard.db");

app.use(cors());
app.use(express.json());

db.exec(`
  CREATE TABLE IF NOT EXISTS apps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    image_url TEXT,
    category TEXT DEFAULT 'General'
  )
`);

app.get("/api/apps", (req, res) => {
  const apps = db.prepare("SELECT * FROM apps ORDER BY name").all();
  res.json(apps);
});

app.post("/api/apps", (req, res) => {
  const { name, description, url, image_url, category } = req.body;

  if (!name || !url) {
    return res.status(400).json({ error: "Name and URL are required" });
  }

  const result = db
    .prepare(
      `
    INSERT INTO apps (name, description, url, image_url, category)
    VALUES (?, ?, ?, ?, ?)
  `,
    )
    .run(name, description || "", url, image_url || "", category || "General");

  res.json({ id: result.lastInsertRowid });
});

app.delete("/api/apps/:id", (req, res) => {
  db.prepare("DELETE FROM apps WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

app.listen(3001, () => {
  console.log("Dashboard API running on port 3001");
});
