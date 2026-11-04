const app = require("./modules/app");
const db = require("./shared/config/db");
const { config } = require("./shared/config/env");

const port = config.port || 3000;

db.raw("select 1")
  .then(() => app.listen(port, () => console.log(`http://localhost:${port}`)))
  .catch((e) => console.error(`Error: ${e}`));
  