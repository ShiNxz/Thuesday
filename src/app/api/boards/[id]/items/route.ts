import { NextResponse } from 'next/server';
import { db, items as itemsTable, columnValues as colVals } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const userId = req.headers.get('cookie')?.match(/userId=([^;]+)/)?.[1];
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const items = await db.select().from(itemsTable).where(eq(itemsTable.boardId, Number(params.id)));
  for (const item of items) {
    const vals = await db.select().from(colVals).where(eq(colVals.itemId, item.id));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item as any).values = Object.fromEntries(vals.map(v => [v.columnId, v.value]));
  }
  return NextResponse.json({ items });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const userId = req.headers.get('cookie')?.match(/userId=([^;]+)/)?.[1];
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { text, parentId, values } = await req.json();
  const result = await db
    .insert(itemsTable)
    .values({ boardId: Number(params.id), text, status: 'todo', parentId });
  const itemId = result.insertId;
  if (values) {
    for (const [columnId, value] of Object.entries(values)) {
      await db.insert(colVals).values({ itemId, columnId: Number(columnId), value: String(value) });
    }
  }
  return NextResponse.json({ id: itemId }, { status: 201 });
}
