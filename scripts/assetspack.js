const fs = require('fs');
const path = require('path');
const base64 = require('base-64');
const package = require('../package.json');

const sqljs_sqlwasm = fs.readFileSync(path.join(__dirname, "..", "node_modules", "sql.js", "dist", "sql-wasm.wasm"));
const sqljs_sqlwasm_v = package.dependencies['sql.js'].replace(`.`, `_`).replace(`^`, ``);
const sqljs_sqlwasm_base64 = base64.encode(sqljs_sqlwasm.toString('binary'));
fs.writeFileSync(path.join(__dirname, "..", "src", "assets", "sqljswasm.ts"),
    `// This file is auto-generated do not edit manually
export const BIN_SQLJS = {
    version: "${sqljs_sqlwasm_v}",
    data: "${sqljs_sqlwasm_base64}"
}`);