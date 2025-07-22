'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Item { id: number; text: string; status: string; }

export default function BoardPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const boardId = params.id;

  useEffect(() => {
    fetch(`/api/boards/${boardId}/items`).then(async res => {
      if (res.status === 401) { router.push('/login'); return; }
      const data = await res.json();
      setItems(data.items);
    });
  }, [boardId, router]);

  async function refresh() {
    const res = await fetch(`/api/boards/${boardId}/items`);
    const data = await res.json();
    setItems(data.items);
  }

  async function addItem() {
    const text = prompt('Item text');
    if (!text) return;
    await fetch(`/api/boards/${boardId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    refresh();
  }

  async function cycleStatus(item: Item) {
    const order = ['todo', 'in-progress', 'done'];
    const next = order[(order.indexOf(item.status) + 1) % order.length];
    await fetch(`/api/items/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next })
    });
    refresh();
  }

  async function deleteItem(itemId: number) {
    await fetch(`/api/items/${itemId}`, { method: 'DELETE' });
    refresh();
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Items</h1>
      <ul className="space-y-2">
        {items.map(item => (
          <li
            key={item.id}
            className="border rounded p-2 cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={() => cycleStatus(item)}
            onDoubleClick={() => deleteItem(item.id)}
          >
            <span className="mr-2">{item.text}</span>
            <span className="text-sm text-gray-500">({item.status})</span>
          </li>
        ))}
      </ul>
      <button onClick={addItem} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">Add Item</button>
    </div>
  );
}
