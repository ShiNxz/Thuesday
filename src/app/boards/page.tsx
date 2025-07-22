'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Board { id: number; name: string; }

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const router = useRouter();
  useEffect(() => {
    fetch('/api/boards').then(async res => {
      if (res.status === 401) { router.push('/login'); return; }
      const data = await res.json();
      setBoards(data.boards);
    });
  }, [router]);

  async function createBoard() {
    const name = prompt('Board name');
    if (!name) return;
    await fetch('/api/boards', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name }) });
    const res = await fetch('/api/boards');
    const data = await res.json();
    setBoards(data.boards);
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Boards</h1>
      <ul className="flex flex-col gap-3">
        {boards.map(b => (
          <li key={b.id} className="border rounded p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
            <Link href={`/boards/${b.id}`}>{b.name}</Link>
          </li>
        ))}
      </ul>
      <button onClick={createBoard} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">New Board</button>
    </div>
  );
}
