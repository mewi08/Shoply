/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  await knex('productos').insert([
    // Tienda 1
    { id: 1, idtienda: 1, idmarca: 1, idcategoria: 1, idunidadmedida: 1, nombre: 'Leche evaporada', codigo: '00000001', presentacion: '400 g', precio_venta: 4.50, cantidad_minima: 12 },
    { id: 2, idtienda: 1, idmarca: 1, idcategoria: 1, idunidadmedida: 1, nombre: 'Yogurt bebible fresa', codigo: '00000002', presentacion: '1 L', precio_venta: 8.90, cantidad_minima: 6 },
    { id: 3, idtienda: 1, idmarca: 2, idcategoria: 1, idunidadmedida: 1, nombre: 'Mantequilla', codigo: '00000003', presentacion: '200 g', precio_venta: 8.50, cantidad_minima: 5 },
    { id: 4, idtienda: 1, idmarca: 3, idcategoria: 2, idunidadmedida: 1, nombre: 'Inca Kola', codigo: '00000004', presentacion: '1.5 L', precio_venta: 8.50, cantidad_minima: 12 },
    { id: 5, idtienda: 1, idmarca: 4, idcategoria: 2, idunidadmedida: 1, nombre: 'Coca-Cola', codigo: '00000005', presentacion: '2 L', precio_venta: 9.50, cantidad_minima: 12 },
    { id: 6, idtienda: 1, idmarca: 5, idcategoria: 3, idunidadmedida: 6, nombre: 'Fideo spaghetti', codigo: '00000006', presentacion: '500 g', precio_venta: 3.80, cantidad_minima: 10 },
    { id: 7, idtienda: 1, idmarca: 6, idcategoria: 3, idunidadmedida: 2, nombre: 'Arroz extra', codigo: '00000007', presentacion: 'Granel', precio_venta: 4.20, cantidad_minima: 20 },
    { id: 8, idtienda: 1, idmarca: 6, idcategoria: 3, idunidadmedida: 2, nombre: 'Azúcar rubia', codigo: '00000008', presentacion: 'Granel', precio_venta: 3.90, cantidad_minima: 15 },
    { id: 9, idtienda: 1, idmarca: 7, idcategoria: 3, idunidadmedida: 1, nombre: 'Atún en aceite', codigo: '00000009', presentacion: '170 g', precio_venta: 5.50, cantidad_minima: 10 },
    { id: 10, idtienda: 1, idmarca: 8, idcategoria: 4, idunidadmedida: 1, nombre: 'Chocolate Sublime', codigo: '00000010', presentacion: '30 g', precio_venta: 1.50, cantidad_minima: 20 },
    { id: 11, idtienda: 1, idmarca: 9, idcategoria: 6, idunidadmedida: 1, nombre: 'Aceite vegetal', codigo: '00000011', presentacion: '1 L', precio_venta: 10.90, cantidad_minima: 6 },
    { id: 12, idtienda: 1, idmarca: 10, idcategoria: 5, idunidadmedida: 1, nombre: 'Lavavajilla', codigo: '00000012', presentacion: '500 g', precio_venta: 4.50, cantidad_minima: 6 },
    { id: 13, idtienda: 1, idmarca: null, idcategoria: 7, idunidadmedida: 1, nombre: 'Pan francés', codigo: '00000013', presentacion: 'Unidad', precio_venta: 0.30, cantidad_minima: 50 },
    { id: 14, idtienda: 1, idmarca: null, idcategoria: 1, idunidadmedida: 2, nombre: 'Queso fresco', codigo: '00000014', presentacion: 'Granel', precio_venta: 18.00, cantidad_minima: 2 },
    // Tienda 2 (el código vuelve a empezar en 1)
    { id: 15, idtienda: 2, idmarca: 1, idcategoria: 1, idunidadmedida: 1, nombre: 'Leche evaporada', codigo: '00000001', presentacion: '400 g', precio_venta: 4.60, cantidad_minima: 12 },
    { id: 16, idtienda: 2, idmarca: 3, idcategoria: 2, idunidadmedida: 1, nombre: 'Inca Kola', codigo: '00000002', presentacion: '1.5 L', precio_venta: 8.70, cantidad_minima: 12 },
    { id: 17, idtienda: 2, idmarca: 6, idcategoria: 3, idunidadmedida: 2, nombre: 'Arroz extra', codigo: '00000003', presentacion: 'Granel', precio_venta: 4.30, cantidad_minima: 20 },
  ]);
};
