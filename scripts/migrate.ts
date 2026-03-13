import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = postgres(DATABASE_URL);

async function migrate() {
  const migrationsDir = join(process.cwd(), 'migrations');
  const files = (await readdir(migrationsDir))
    .filter((f) => f.endsWith('.sql'))
    .sort();

  console.log(`Running ${files.length} migration(s)...`);

  for (const file of files) {
    const filePath = join(migrationsDir, file);
    const content = await readFile(filePath, 'utf-8');

    // Skip files that are only comments
    const nonCommentContent = content.replace(/--.*$/gm, '').trim();
    if (!nonCommentContent) {
      console.log(`  Skipping ${file} (no executable SQL)`);
      continue;
    }

    console.log(`  Running ${file}...`);
    try {
      await sql.unsafe(content);
      console.log(`  ✓ ${file}`);
    } catch (err) {
      console.error(`  ✗ ${file}: ${err}`);
      await sql.end();
      process.exit(1);
    }
  }

  console.log('Migrations complete.');
  await sql.end();
}

migrate();
