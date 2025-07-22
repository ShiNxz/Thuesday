import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import db from '@/lib/db';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (user && await bcrypt.compare(password, user.password)) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set('userId', String(user.id), { httpOnly: true });
    return res;
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
