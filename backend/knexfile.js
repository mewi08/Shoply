const { config } = require('./src/shared/config/env');

module.exports = {
  client: 'mysql2',
  connection: {
    ...config.db,
    charset: 'utf8mb4'
  },
  migrations: { directory: './src/db/migrations' },
  seeds: { directory: './src/db/seeds' }
}