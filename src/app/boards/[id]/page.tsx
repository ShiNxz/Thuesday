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
    <div className="p-4">
      <h1 className="text-2xl mb-4">Items</h1>
      <ul className="flex flex-col gap-2">
        {items.map(item => (
          <li key={item.id}
              className="cursor-pointer select-none"
              onClick={() => cycleStatus(item)}
              onDoubleClick={() => deleteItem(item.id)}>
            {item.text} - {item.status}
          </li>
        ))}
      </ul>
      <button onClick={addItem} className="mt-4 bg-blue-500 text-white px-2 py-1">Add Item</button>
    </div>
  );
}
