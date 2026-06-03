const db = require('./src/db');
db.select('*').from('users').then(console.log).catch(console.error).finally(() => process.exit());