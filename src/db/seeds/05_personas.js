/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('personas').insert([
    // Personas que serán usuarios
    { id: 1, nombres: 'Carlos', ape_paterno: 'Ramírez', ape_materno: 'Torres', telefono: '999111222', correo: 'carlos@correo.com', direccion: 'Av. Brasil 100', tipo_doc: 'DNI', num_doc: '45678912' },
    { id: 2, nombres: 'María', ape_paterno: 'López', ape_materno: 'Quispe', telefono: '999333444', correo: 'maria@correo.com', direccion: 'Jr. Cusco 250', tipo_doc: 'DNI', num_doc: '71234567' },
    { id: 3, nombres: 'José', ape_paterno: 'Huamán', ape_materno: 'Flores', telefono: '999555666', correo: 'jose@correo.com', direccion: 'Av. Perú 789', tipo_doc: 'DNI', num_doc: '70123456' },
    // Clientes
    { id: 4, nombres: 'Ana', ape_paterno: 'Torres', ape_materno: 'Vega', telefono: '988111000', correo: null, direccion: 'Calle Lima 12', tipo_doc: 'DNI', num_doc: '46789123' },
    { id: 5, nombres: 'Luis', ape_paterno: 'Mendoza', ape_materno: 'Rojas', telefono: null, correo: null, direccion: null, tipo_doc: 'DNI', num_doc: '43219876' },
    { id: 6, razon_social: 'Restaurante El Buen Sabor S.A.C.', telefono: '977222333', correo: 'ventas@buensabor.com', direccion: 'Av. Gastronomía 321', tipo_doc: 'RUC', num_doc: '20555666771' },
    { id: 7, nombres: 'Pedro', ape_paterno: 'Castillo', ape_materno: 'Silva', telefono: null, correo: null, direccion: null, tipo_doc: 'CE', num_doc: '001234567' },
    { id: 8, nombres: 'Rosa', ape_paterno: 'Paredes', ape_materno: 'Díaz', telefono: '966444555', correo: null, direccion: 'Psje. Los Pinos 5', tipo_doc: 'DNI', num_doc: '40123987' },
  ]);
};
