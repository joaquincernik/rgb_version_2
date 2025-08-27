import models from '../models/index.js';

export async function findAll() {
  return await models.Photo.findAll();
}

export async function create(data) {
  return await models.Photo.create(data);
}