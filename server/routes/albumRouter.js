import { Router } from "express";
import * as albumController from "../controllers/albumController.js";
import multer from "multer";
import path from 'path';
import { fileURLToPath } from 'url';
 
const router = Router();
// __dirname no existe en ESM → lo definimos manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de multer (disco)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => {
    // nombre único: timestamp + nombre original saneado
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    cb(null, `${Date.now()}-${base}${ext}`);
  }
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
router.post("/create", upload.array("images"), (req, res) => {
    console.log('====================================');
    console.log(req.file);
    console.log(req.body);

    console.log('====================================');
/*   const files = (req.files || []).map((f) => ({
    originalname: f.originalname,
    filename: f.filename,
    url: `/uploads/${f.filename}`,
  }));
 */
  res.json({
    ok: true,
    message: "Imágenes subidas",
    //files,
    fields: req.body,
  });
});

// Manejo de errores de multer (mensajes claros)
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ ok: false, error: err.message });
  }
  if (err) {
    return res.status(400).json({ ok: false, error: err.message });
  }
  next();
});

export default router;
