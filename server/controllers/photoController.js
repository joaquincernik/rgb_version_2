import * as photoService from '../services/photoService.js';

export async function getPhotos(req, res, next) {
  try {
    const photo = await photoService.findAll();
    res.json(photo);
  } catch (err) {
    next(err);
  }
}
