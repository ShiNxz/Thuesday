import { NextResponse } from 'next/server';
import { db, items as itemsTable } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const userId = req.headers.get('cookie')?.match(/userId=([^;]+)/)?.[1];
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const items = await db.select().from(itemsTable).where(eq(itemsTable.boardId, Number(params.id)));
  return NextResponse.json({ items });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const userId = req.headers.get('cookie')?.match(/userId=([^;]+)/)?.[1];
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { text } = await req.json();
  const result = await db
    .insert(itemsTable)
    .values({ boardId: Number(params.id), text, status: 'todo' });
  return NextResponse.json({ id: result.insertId }, { status: 201 });
}
