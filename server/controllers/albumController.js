import * as albumService from "../services/albumService.js";
import * as photoService from "../services/photoService.js";

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

export async function listAlbumDetail(req, res, next) {
  try {
    const album = await albumService.findById(req.params.id);
    console.log("====================================");
    console.log(album.Photos);
    console.log("====================================");
    res.json(album);
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
    const cover = (await req.files?.cover?.[0])
      ? {
          filename: req.files.cover[0].filename,
          url: `/uploads/${req.files.cover[0].filename}`,
        }
      : null;

    console.log("====================================");
    console.log(req.files?.images);
    console.log("====================================");
    const album = await albumService.create(req.body, cover.filename);
    if (req.files?.images) {
      const images = (req.files?.images || []).map((f) => ({
        filename: f.filename,
        url: `/uploads/${f.filename}`,
      }));

      const result = await Promise.all(
        images.map((img) => {
          const a = photoService.create(img, album.album_id);
        })
      );
    }

    res.status(200).json(album);
  } catch (err) {
    next(err);
  }
}

export async function updateAlbum(req, res, next) {
  try {
    const { name, date, link } = req.body;
    const album = await albumService.findById(req.params.id);
    if (!album) return res.status(404).json({ error: "No encontrado" });

    const patch = { name, date, link };
    if (req.file) {
      patch.cover = req.file.filename;
    }
    await album.update(patch);

    res.status(200).json({ album });
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
