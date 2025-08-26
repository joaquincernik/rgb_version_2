import * as userService from '../services/userService.js';

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
    if (!user) return res.status(404).json({ error: 'No existe' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function createUser(req, res, next) {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const user = await userService.update(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: 'No existe' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const deleted = await userService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'No existe' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
