import { db } from '../db.js';
import type { User } from '../../types.js';

export async function findByGoogleId(googleId: string): Promise<User | null> {
  const rows = await db<User[]>`
    SELECT * FROM users WHERE google_id = ${googleId} LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function upsertUser(data: {
  google_id: string;
  email: string;
  name: string;
  avatar_url: string | null;
}): Promise<User> {
  const rows = await db<User[]>`
    INSERT INTO users (google_id, email, name, avatar_url)
    VALUES (${data.google_id}, ${data.email}, ${data.name}, ${data.avatar_url})
    ON CONFLICT (google_id) DO UPDATE SET
      email = EXCLUDED.email,
      name = EXCLUDED.name,
      avatar_url = EXCLUDED.avatar_url
    RETURNING *
  `;
  return rows[0];
}

export async function listUsers(): Promise<User[]> {
  return db<User[]>`SELECT * FROM users ORDER BY name`;
}

export async function setRole(userId: string, role: 'admin' | 'user'): Promise<void> {
  await db`UPDATE users SET role = ${role} WHERE id = ${userId}`;
}

export async function getUserById(id: string): Promise<User | null> {
  const rows = await db<User[]>`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
  return rows[0] ?? null;
}

export async function updateChartColor(userId: string, color: string): Promise<void> {
  await db`UPDATE users SET chart_color = ${color} WHERE id = ${userId}`;
}
