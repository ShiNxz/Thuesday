import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  const userId = request.headers.get('cookie')?.match(/userId=([^;]+)/)?.[1];
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const boards = db.prepare('SELECT * FROM boards WHERE user_id = ?').all(userId);
  return NextResponse.json({ boards });
}

export async function POST(request: Request) {
  const userId = request.headers.get('cookie')?.match(/userId=([^;]+)/)?.[1];
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { name } = await request.json();
  const stmt = db.prepare('INSERT INTO boards(name, user_id) VALUES (?, ?)');
  const info = stmt.run(name, userId);
  return NextResponse.json({ id: info.lastInsertRowid }, { status: 201 });
}
