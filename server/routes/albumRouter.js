
import { Router } from "express";
import * as albumController from "../controllers/albumController.js"

const router = Router()

router.get("/", albumController.getAlbums);
router.get("/list", albumController.listAlbums);


export default router;