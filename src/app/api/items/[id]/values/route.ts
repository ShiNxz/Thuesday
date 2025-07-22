import { NextResponse } from 'next/server';
import { db, columnValues as colVals } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const userId = req.headers.get('cookie')?.match(/userId=([^;]+)/)?.[1];
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const values: Record<number, string> = await req.json();
  await db.delete(colVals).where(eq(colVals.itemId, Number(params.id)));
  for (const [columnId, value] of Object.entries(values)) {
    await db.insert(colVals).values({ itemId: Number(params.id), columnId: Number(columnId), value });
  }
  return NextResponse.json({ ok: true });
}
