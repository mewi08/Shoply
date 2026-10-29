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

exports.config = {
  port: Number(process.env.PORT) || 3000,
  environment: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expires: process.env.JWT_EXPIRES_IN || '8h',
  },
};