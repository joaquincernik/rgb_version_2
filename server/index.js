import express from "express";
import cors from "cors";
import sequelize from "./database.js";
import "./models/index.js"; // importa y registra asociaciones

import userRouter from "./routes/userRouter.js"
import albumRouter from "./routes/albumRouter.js"
import photoRouter from "./routes/photoRouter.js"

import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

await sequelize
  .authenticate()
  .then(() => console.log("✅ Conexión a MySQL exitosa"))
  .catch((err) => console.error("❌ Error al conectar a MySQL:", err));

await sequelize.sync({ alter: false }); // o { force: false } en prod

app.use("/api/users", userRouter)
app.use("/api/albums", albumRouter)
app.use("/api/photos", photoRouter)

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
