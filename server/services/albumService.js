import models from "../models/index.js";
import { Op } from "sequelize";

export async function findAll(limit) {
  return await models.Album.findAll({
    ...(limit ? { limit } : {}),
    order: [["date", "DESC"]],
  });
  //return await models.Album.findAll();
}

export async function list(q) {
  const page = Math.max(parseInt(q.page ?? "1", 10) || 1, 1);
  const pageSize = Math.min(
    Math.max(parseInt(q.pageSize ?? "20", 10) || 20, 1),
    100
  );
  const offset = (page - 1) * pageSize;

  const limit = pageSize;
  const order = [["date", "DESC"]];
  const where = {};

  //type
  if (q.type === "videos") {
    where.link = { [Op.ne]: null };
  } else if (q.type === "fotos") {
    // si es fotos → la columna link debe ser NOT NULL
    where.link = { [Op.is]: null };
  }

  //name
    if (q.search) {
    where.name = { [Op.like]: `%${q.search}%` }  // busca substring en el campo "name"
  }


  //tengo que ver que esta pidiendo
  const { rows, count } = await models.Album.findAndCountAll({
    where,
    order,
    limit,
    offset,
  });

  return {
    data: rows,
    page,
    pageSize,
    total: count,
    totalPages: Math.ceil(count / pageSize),
    hasNextPage: page * pageSize < count,
    hasPrevPage: page > 1,
  };
}

export async function findById(id) {
  return await models.Album.findByPk(id, {
      include: [{ model: models.Photo, order: [["photo_id", "ASC"]] }],
    } );
}

export async function create(data, cover) {
  const albuToCreate = {
    ...data,
    cover: cover
  }
  return await models.Album.create(albuToCreate);
}

export async function update(id, data) {
  const [rows] = await models.Album.update(data, { where: { id } });
  if (rows === 0) return null;
  return await findById(id);
}

export async function remove(id) {
  return await models.Album.destroy({ where: { id } });
}
