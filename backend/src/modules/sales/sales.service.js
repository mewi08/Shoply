const db = require("../../shared/config/db");
const { httpError } = require("../../shared/utils/response");
const batches = require("../batches/batches.service");

const round2 = (n) => Math.round(n * 100) / 100;

const baseQuery = (idtienda) =>
  db("ventas as v")
    .join("usuarios as u", "v.idvendedor", "u.id")
    .leftJoin("personas as p", "v.idcliente", "p.id") 
    .where("v.idtienda", idtienda)
    .select(
      "v.id", "v.metodo_pago", "v.estado", "v.created_at",
      "u.username as vendedor",
      db.raw("COALESCE(p.razon_social, CONCAT(p.nombres, ' ', p.ape_paterno)) as cliente")
    );

const mergeItems = (items = []) => {
  if (items.length === 0) throw httpError(400, "Agrega al menos un producto");
  const map = new Map();
  for (const item of items) {
    const cantidad = Number(item.cantidad);
    const idproducto = Number(item.idproducto);
    if (!idproducto || cantidad <= 0) throw httpError(400, "Producto o cantidad inválidos");
    map.set(idproducto, (map.get(idproducto) ?? 0) + cantidad);
  }
  return map;
};

const checkPayment = (data) => {
  const { total, metodo_pago, monto_recibido } = data;
  const validMethods = ['efectivo', 'transferencia', 'billetera digital'];
  
  if (!validMethods.includes(metodo_pago)) throw httpError(400, "Método de pago no válido");

  if (metodo_pago !== "efectivo") return { received: total, change: 0 };
  
  const received = Number(monto_recibido);
  if (!received || received < total) throw httpError(400, "Monto recibido insuficiente");
  
  return { received: round2(received), change: round2(received - total) };
};

const takeStock = async (options) => {
  const { trx, product, quantity, idtienda } = options;

  const lots = await trx("lotes")
    .where({ idproducto: product.id })
    .where("cantidad_actual", ">", 0)
    .orderBy("id", "asc")
    .forUpdate()
    .select("id", "cantidad_actual");

  const rows = [];
  let remaining = quantity;

  for (const lot of lots) {
    if (remaining <= 0) break;

    const taken = Math.min(remaining, Number(lot.cantidad_actual));
    await batches.deductStock(trx, { id: lot.id, cantidad: taken, idtienda });

    rows.push({
      idlote: lot.id,
      cantidad: taken,
      precio_unitario: product.precio_venta,
    });

    remaining -= taken;
  }

  if (remaining > 0) {
    throw httpError(409, `Stock insuficiente de ${product.nombre}`);
  }

  return rows;
};

exports.list = (idtienda) => baseQuery(idtienda).orderBy("v.created_at", "desc");

exports.get = async (id, idtienda) => {
  const sale = await baseQuery(idtienda).where("v.id", id).first();
  if (!sale) throw httpError(404, "Venta no encontrada");

  const lines = await db("detalles_venta as d")
    .join("lotes as l", "l.id", "d.idlote")
    .join("productos as p", "p.id", "l.idproducto")
    .where("d.idventa", id)
    .groupBy("l.idproducto", "p.nombre", "d.precio_unitario")
    .select("p.nombre", "d.precio_unitario")
    .sum({ cantidad: "d.cantidad" });

  const total = lines.reduce((sum, line) => sum + (Number(line.precio_unitario) * Number(line.cantidad)), 0);

  return {
    ...sale,
    total: round2(total),
    detalle: lines.map((line) => ({
      ...line,
      subtotal: round2(Number(line.precio_unitario) * Number(line.cantidad)),
    })),
  };
};

exports.create = async (data, user) => {
  if (!data) throw httpError(400, "Datos inválidos");
  
  return db.transaction(async (trx) => {
    const quantities = mergeItems(data.items);
    const { idtienda } = user;

    const products = await trx("productos")
      .whereIn("id", [...quantities.keys()])
      .where({ idtienda })
      .select("id", "nombre", "precio_venta");

    if (products.length !== quantities.size) throw httpError(404, "Producto no encontrado");

    const total = round2(
      products.reduce((s, p) => s + Number(p.precio_venta) * quantities.get(p.id), 0)
    );

    const { change } = checkPayment({ total, ...data });

    if (data.idcliente) {
      const client = await trx("personas").where({ id: data.idcliente }).first("id");
      if (!client) throw httpError(404, "Cliente no encontrado");
    }

    const [id] = await trx("ventas").insert({
      idtienda,
      idvendedor: user.id,
      idcliente: data.idcliente ?? null,
      metodo_pago: data.metodo_pago,
      estado: 'completada'
    });

    const detail = [];
    for (const p of products) {
      const rows = await takeStock({ trx, product: p, quantity: quantities.get(p.id), idtienda });
      detail.push(...rows);
    }

    await trx("detalles_venta").insert(
      detail.map((r) => ({ ...r, idventa: id }))
    );

    return { id, total, vuelto: change };
  });
};

exports.cancel = (id, idtienda) =>
  db.transaction(async (trx) => {
    const num = await trx("ventas")
      .where({ id, idtienda, estado: "completada" })
      .update({ estado: "anulada" });
      
    if (!num) throw httpError(404, "Venta no encontrada o ya anulada");

    const lines = await trx("detalles_venta").where({ idventa: id });
    for (const line of lines) {
      await batches.restoreStock(trx, {
        id: line.idlote,
        cantidad: line.cantidad,
        idtienda,
      });
    }
  });