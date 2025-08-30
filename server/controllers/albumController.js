import * as albumService from "../services/albumService.js";

export async function getAlbums(req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || undefined;
    const albums = await albumService.findAll(limit);
    res.json({
      albums,
      count: albums.length,
    });
  } catch (err) {
    next(err);
  }
}

export async function listAlbums(req, res, next) {
  try {
    const albums = await albumService.list(req.query);
    res.json({
      albums,
      count: albums.length,
    });
  } catch (err) {
    next(err);
  }
}


export async function getAlbum(req, res, next) {
  try {
    const album = await albumService.findById(req.params.id);
    if (!album) return res.status(404).json({ error: "No existe" });
    res.json(album);
  } catch (err) {
    next(err);
  }
}

export async function createAlbum(req, res, next) {
  try {
    const album = await albumService.create(req.body);
    res.status(201).json(album);
  } catch (err) {
    next(err);
  }
}

export async function updateAlbum(req, res, next) {
  try {
    const album = await albumService.update(req.params.id, req.body);
    if (!album) return res.status(404).json({ error: "No existe" });
    res.json(album);
  } catch (err) {
    next(err);
  }
}

export async function deleteAlbum(req, res, next) {
  try {
    const deleted = await albumService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: "No existe" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
