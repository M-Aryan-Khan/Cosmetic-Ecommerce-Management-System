import pkg from "pg";
const {Pool} = pkg;

const pool = new Pool({
    user: 'postgres',
    password: '',
    host: 'localhost',
    port: 5432,
    database: 'cosmetic_ms'
})

export default pool;
