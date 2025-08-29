import models from '../models/index.js';

export async function findAll(limit) {
  return await models.Album.findAll({
    ...(limit ? { limit } : {}),
    order: [['date', 'DESC']]
  });
  //return await models.Album.findAll();
}

export async function findById(id) {
  return await models.Album.findByPk(id);
}

export async function create(data) {
  return await models.Album.create(data);
}

export async function update(id, data) {
  const [rows] = await models.Album.update(data, { where: { id } });
  if (rows === 0) return null;
  return await findById(id);
}

export async function remove(id) {
  return await models.Album.destroy({ where: { id } });
}
