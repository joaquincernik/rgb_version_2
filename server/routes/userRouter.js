
import { Router } from "express";
import * as userController from "../controllers/userController.js"

const router = Router()

router.get("/", userController.getUsers);
router.post("/create", userController.createUser);

router.get("/find/:id", userController.getUser);
router.patch("/edit/:id", userController.updateUser);
router.delete("/delete/:id", userController.deleteUser);

export default router;