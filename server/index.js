import express from "express";
import cors from "cors";
import sequelize from "./database.js";
import "./models/index.js"; // importa y registra asociaciones
import * as userController from "./controllers/userController.js";
import * as albumController from "./controllers/albumController.js";
import * as photoController from "./controllers/photoController.js";
import fetch from "node-fetch"; // en Node <18 instalar: npm i node-fetch

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

/* let todos = [
  { id: 1, text: "Aprender Vue", done: false },
  { id: 2, text: "Crear API con Express", done: true },
];

// Rutas API
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "text es requerido" });
  const newTodo = { id: Date.now(), text, done: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.patch("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((t) => t.id === id);
  if (!todo) return res.status(404).json({ error: "No existe" });
  Object.assign(todo, req.body);
  res.json(todo);
});

app.delete("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  todos = todos.filter((t) => t.id !== id);
  res.status(204).end();
});
 */
await sequelize
  .authenticate()
  .then(() => console.log("✅ Conexión a MySQL exitosa"))
  .catch((err) => console.error("❌ Error al conectar a MySQL:", err));

await sequelize.sync({ alter: false }); // o { force: false } en prod
// Rutas de ejemplo

app.get("/api/users", userController.getUsers);
app.get("/api/users/:id", userController.getUser);
app.post("/api/users", userController.createUser);
app.patch("/api/users/:id", userController.updateUser);
app.delete("/api/users/:id", userController.deleteUser);

//albums
app.get("/api/albums", albumController.getAlbums);

//photos
//albums
app.get("/api/photos", photoController.getPhotos);

//yt
app.get("/api/youtube/latest", async (req, res) => {
  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");

    
    url.searchParams.set("key", process.env.API_KEY);
    url.searchParams.set("channelId", process.env.CHANNEL_ID);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("order", "date");
    url.searchParams.set("maxResults", "2");
    url.searchParams.set("type", "video");

    const r = await fetch(url);
    const data = await r.json();

    const videos = (data.items || []).map((i) => ({
      title: i.snippet.title,
      publishedAt: new Date(i.snippet.publishedAt).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      thumbnail: i.snippet.thumbnails?.high?.url,
      url: `https://www.youtube.com/watch?v=${i.id.videoId}`,
    }));

    res.json({ videos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error consultando YouTube" });
  }
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
