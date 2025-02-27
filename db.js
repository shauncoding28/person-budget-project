const { Pool } = require('pg');



const pool = new Pool({

    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT

})

pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
        console.log('pool not created');
    } else {
        console.log('pool created');
        release();
    }
});

module.exports = pool;