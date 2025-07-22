import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const user = await db.select().from(users).where(eq(users.username, username)).then(r => r[0]);
  if (user && await bcrypt.compare(password, user.password)) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set('userId', String(user.id), { httpOnly: true });
    return res;
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
