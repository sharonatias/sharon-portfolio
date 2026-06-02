const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

// Supabase connection details
const pool = new Pool({
  host: 'whqqammiamoajavokauw.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: process.env.DB_PASSWORD || process.env.SUPABASE_DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
})

async function runMigration() {
  const client = await pool.connect()
  try {
    console.log('🔄 Running migration...')

    // Read the migration file
    const migrationPath = path.join(__dirname, 'SQL_MIGRATION_SECTION_LABELS.sql')
    const sql = fs.readFileSync(migrationPath, 'utf-8')

    // Execute the migration
    await client.query(sql)

    console.log('✅ Migration completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

runMigration()
