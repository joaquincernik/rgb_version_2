
import { Router } from "express";
import * as userController from "../controllers/userController.js"
import { isAdmin } from '../middlewares/isAdmin.js'

const router = Router()

router.get("/", userController.getUsers);
router.post("/register", userController.createUser);
router.post("/login",userController.logUser)
router.get("/find/:id", userController.getUser);
router.patch("/edit/:id", userController.updateUser);
router.delete("/delete/:id", userController.deleteUser);

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.status(204).end())
})

router.get('/me', (req, res) => {
  return res.json({ user: req.session?.user ?? null })
})

router.get('/admin', isAdmin, (req, res) => {
  res.json({ msg: 'Bienvenido admin' })
})
export default router;