'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) router.push('/login');
    else alert('Failed');
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm mx-auto mt-16 p-6 border rounded bg-white shadow">
      <input className="border rounded p-2" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
      <input type="password" className="border rounded p-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="bg-blue-600 hover:bg-blue-700 text-white rounded p-2" type="submit">Register</button>
    </form>
  );
}
