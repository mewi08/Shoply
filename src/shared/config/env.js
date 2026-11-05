require('dotenv').config();

const required = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);

if(missing.length){
  console.error(`Faltan variables de entorno: ${ missing.join(',') }`);
  process.exit(1);
}

const secret = process.env.JWT_SECRET;

if(secret.length < 32){
  console.error(`JWT_SECRET requiere al menos 32 caracteres`);
  process.exit(1);
}

exports.config = {
  port: Number(process.env.PORT) || 3000,
  environment: process.env.NODE_ENV || 'development',
  trustProxy: process.env.TRUST_PROXY ? Number(process.env.TRUST_PROXY) : false,
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
  superadmin: {
    username: process.env.SUPERADMIN_USER,
    password: process.env.SUPERADMIN_PASSWORD,
  },
};