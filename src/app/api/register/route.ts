import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import db from '@/lib/db';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const hash = await bcrypt.hash(password, 10);
  try {
    const stmt = db.prepare('INSERT INTO users(username, password) VALUES (?, ?)');
    const info = stmt.run(username, hash);
    return NextResponse.json({ id: info.lastInsertRowid }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'User exists' }, { status: 400 });
  }
}
