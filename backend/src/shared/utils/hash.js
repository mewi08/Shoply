const bcrypt = require("bcryptjs"); 
const SALTOS = 10;

exports.hashPassword = (password) => bcrypt.hashSync(password, SALTOS);

exports.comparePassword = (password, hash) => bcrypt.compare(password, hash);