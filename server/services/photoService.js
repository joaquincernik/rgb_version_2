import models from '../models/index.js';

export async function findAll() {
  return await models.Photo.findAll();
}

export async function create(data, album_id) {
  const photoToCreate = {
    link:data.filename ,
    album_id : album_id
  }
  const res =  await models.Photo.create(photoToCreate);
  }