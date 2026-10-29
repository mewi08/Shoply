const required = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);

if(missing.length){
  console.error(`Faltan variables de entorno ${ missing.join(',') }`);
  process.exit(1);
}

const secret = process.env.JWT_SECRET;

if(secret.length < 32){
  console.log(`JWT_SECRET requiere una clave de 32 caracteres`);
  process.exit(1);
}
