import { Router } from "express";
import * as albumController from "../controllers/albumController.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();
// __dirname no existe en ESM → lo definimos manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, "../uploads");
// Crear la carpeta si no existe
fs.mkdirSync(uploadsDir, { recursive: true });

// Configuración de multer (disco)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    // nombre único: timestamp + nombre original saneado
    const base = file.fieldname + "-" + path.basename(file.originalname);
    /* const base = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-"); */
    const unique = crypto.randomBytes(6).toString("hex"); // 12 caracteres

    cb(null, `${base}`);
  },
});
// Validación de tipo y límite de tamaño
/* function fileFilter(req, file, cb) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Tipo de archivo no permitido (solo jpg, png, webp, gif)'));
  }
  cb(null, true);
} */
const upload = multer({
  storage,
});

router.get("/", albumController.getAlbums);
router.get("/list", albumController.listAlbums);
router.get("/list/:id", albumController.listAlbumDetail);
//router.get("/photos/:id", albumController.listPhotos);

const fields = upload.fields([
  { name: "cover", maxCount: 1 },
  { name: "images", maxCount: 1000 },
]);
router.post("/create", isAdmin,fields, albumController.createAlbum);
router.post("/remove/:id", isAdmin,albumController.deleteAlbum);

router.put('/edit/:id', isAdmin,upload.single('cover'), albumController.updateAlbum)


export default router;
