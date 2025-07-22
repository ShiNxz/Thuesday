import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const userId = req.headers.get('cookie')?.match(/userId=([^;]+)/)?.[1];
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const items = db.prepare('SELECT * FROM items WHERE board_id = ?').all(params.id);
  return NextResponse.json({ items });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const userId = req.headers.get('cookie')?.match(/userId=([^;]+)/)?.[1];
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { text } = await req.json();
  const stmt = db.prepare('INSERT INTO items(board_id, text, status) VALUES (?, ?, ?)');
  const info = stmt.run(params.id, text, 'todo');
  return NextResponse.json({ id: info.lastInsertRowid }, { status: 201 });
}
