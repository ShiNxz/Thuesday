import { NextResponse } from 'next/server';
import { db, boards as boardsTable } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  const userId = request.headers.get('cookie')?.match(/userId=([^;]+)/)?.[1];
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const boards = await db.select().from(boardsTable).where(eq(boardsTable.userId, Number(userId)));
  return NextResponse.json({ boards });
}

export async function POST(request: Request) {
  const userId = request.headers.get('cookie')?.match(/userId=([^;]+)/)?.[1];
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { name } = await request.json();
  const result = await db.insert(boardsTable).values({ name, userId: Number(userId) });
  return NextResponse.json({ id: result.insertId }, { status: 201 });
}
