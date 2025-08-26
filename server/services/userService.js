import models from '../models/index.js';

export async function findAll() {
  return await models.User.findAll();
}

export async function findById(id) {
  return await models.User.findByPk(id);
}

export async function create(data) {
  return await models.User.create(data);
}

export async function update(id, data) {
  const [rows] = await models.User.update(data, { where: { id } });
  if (rows === 0) return null;
  return await findById(id);
}

export async function remove(id) {
  return await models.User.destroy({ where: { id } });
}
