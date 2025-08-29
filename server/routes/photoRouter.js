
import { Router } from "express";
import * as photoController from "../controllers/photoController.js"

const router = Router()

router.get("/", photoController.getPhotos);

export default router;