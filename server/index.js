import express from "express";
import cors from "cors";
import sequelize from "./database.js";
import "./models/index.js"; // importa y registra asociaciones
import session from "express-session";
import userRouter from "./routes/userRouter.js"
import albumRouter from "./routes/albumRouter.js"
import photoRouter from "./routes/photoRouter.js"
import multer from "multer";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from 'url';
 
const app = express();
const PORT = process.env.PORT ?? 3000;
// __dirname no existe en ESM → lo definimos manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Servir estáticos (para poder ver/consumir las imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // en prod con HTTPS => true
}))

await sequelize
  .authenticate()
  .then(() => console.log("✅ Conexión a MySQL exitosa"))
  .catch((err) => console.error("❌ Error al conectar a MySQL:", err));

await sequelize.sync({ alter: false }); // o { force: false } en prod

app.use("/api/users", userRouter)
app.use("/api/albums", albumRouter)
app.use("/api/photos", photoRouter)



// Manejo de errores de multer (mensajes claros)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ ok: false, error: err.message });
  }
  if (err) {
    return res.status(400).json({ ok: false, error: err.message });
  }
  next();
});
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
