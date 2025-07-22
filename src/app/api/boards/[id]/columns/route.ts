import { NextResponse } from 'next/server';
import { db, columns as columnsTable } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const userId = req.headers.get('cookie')?.match(/userId=([^;]+)/)?.[1];
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const cols = await db.select().from(columnsTable).where(eq(columnsTable.boardId, Number(params.id)));
  return NextResponse.json({ columns: cols });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const userId = req.headers.get('cookie')?.match(/userId=([^;]+)/)?.[1];
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { name } = await req.json();
  const result = await db.insert(columnsTable).values({ boardId: Number(params.id), name });
  return NextResponse.json({ id: result.insertId }, { status: 201 });
}
