import { NextResponse } from 'next/server';
import { db, items as itemsTable } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const userId = req.headers.get('cookie')?.match(/userId=([^;]+)/)?.[1];
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { status } = await req.json();
  await db.update(itemsTable).set({ status }).where(eq(itemsTable.id, Number(params.id)));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const userId = req.headers.get('cookie')?.match(/userId=([^;]+)/)?.[1];
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await db.delete(itemsTable).where(eq(itemsTable.id, Number(params.id)));
  return NextResponse.json({ ok: true });
}
