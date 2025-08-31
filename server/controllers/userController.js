import * as userService from "../services/userService.js";
import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;

export async function getUsers(req, res, next) {
  try {
    const users = await userService.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function getUser(req, res, next) {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "No existe" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function createUser(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }
    // ¿Existe email?
    const exists = await userService.findByEmail(email);
    if (exists)
      return res.status(409).json({ error: "El email ya está registrado" });

    // Hash y creación
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await userService.create({ email, password: hash });

    // Guardar sesión (sin el hash)
    req.session.user = { id: user.id, email: user.email };
    res.status(201).json({ user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error registrando usuario" });
  }
}

export async function logUser(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son obligatorios" });
    }

    const user = await userService.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Guardar datos mínimos en sesión (nunca guardes el hash)
    const rol = user.id == 3 ? "admin" : "user";

    req.session.user = { id: user.id, email: user.email, rol: rol };
    return res.json({ user: req.session.user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error en login" });
  }
}

export async function updateUser(req, res, next) {
  try {
    const user = await userService.update(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: "No existe" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const deleted = await userService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: "No existe" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
