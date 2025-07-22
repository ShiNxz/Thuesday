import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db, users } from '@/lib/db';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const hash = await bcrypt.hash(password, 10);
  try {
    const result = await db.insert(users).values({ username, password: hash });
    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'User exists' }, { status: 400 });
  }
}
