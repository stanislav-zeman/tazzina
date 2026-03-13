import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

declare global {
  // eslint-disable-next-line no-var
  var __db: postgres.Sql | undefined;
}

function createDb(): postgres.Sql {
  return postgres(DATABASE_URL!, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });
}

// HMR-safe singleton
export const db: postgres.Sql =
  globalThis.__db ?? (globalThis.__db = createDb());
