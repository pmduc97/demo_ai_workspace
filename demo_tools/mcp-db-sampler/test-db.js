import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "hoian_blog",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
});

async function test() {
  try {
    console.log("Testing DB Connection with current .env settings...");
    const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log("✅ Connection Successful!");
    console.log("Tables found in database:", res.rows.map(r => r.table_name).join(", "));
    
    if (res.rows.length > 0) {
      const firstTable = res.rows[0].table_name;
      console.log(`\nTesting sample data fetch from table '${firstTable}'...`);
      const sampleRes = await pool.query(`SELECT * FROM ${firstTable} LIMIT 1`);
      console.log(JSON.stringify(sampleRes.rows, null, 2));
    }
    
    process.exit(0);
  } catch (err) {
    console.error("❌ DB Connection Error:", err.message);
    process.exit(1);
  }
}
test();