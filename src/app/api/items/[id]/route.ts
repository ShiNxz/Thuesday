import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const userId = req.headers.get('cookie')?.match(/userId=([^;]+)/)?.[1];
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { status } = await req.json();
  const stmt = db.prepare('UPDATE items SET status = ? WHERE id = ?');
  stmt.run(status, params.id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const userId = req.headers.get('cookie')?.match(/userId=([^;]+)/)?.[1];
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const stmt = db.prepare('DELETE FROM items WHERE id = ?');
  stmt.run(params.id);
  return NextResponse.json({ ok: true });
}
