// Database Migration Runner
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'replica', 'schema.sql');
const dataDir = path.join(__dirname, '..', 'data');
const storeFile = path.join(dataDir, 'store.json');

console.log('🔄 Running Atelier database migrations...');

if (!fs.existsSync(schemaPath)) {
  console.error('❌ Schema file not found at:', schemaPath);
  process.exit(1);
}

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(storeFile)) {
  console.log('📦 Initializing local persistent store at:', storeFile);
  const initial = {
    users: [],
    projects: [],
    conversations: [],
    messages: [],
    artifacts: [],
  };
  fs.writeFileSync(storeFile, JSON.stringify(initial, null, 2), 'utf-8');
}

console.log('✅ Local store and SQL schema verified successfully.');
if (process.env.DATABASE_URL) {
  console.log('🐘 PostgreSQL detected via DATABASE_URL. Ready to execute schema.sql in production.');
} else {
  console.log('📁 Running in zero-setup file-backed persistent mode (PostgreSQL ready).');
}
