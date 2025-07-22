'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Item { id: number; text: string; status: string; parentId: number | null; values: Record<number, string>; }
interface Column { id: number; name: string; }

export default function BoardPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const boardId = params.id;

  useEffect(() => {
    refresh();
  }, [boardId, router, refresh]);

  const refresh = useCallback(async () => {
    const [itemsRes, colsRes] = await Promise.all([
      fetch(`/api/boards/${boardId}/items`),
      fetch(`/api/boards/${boardId}/columns`)
    ]);
    if (itemsRes.status === 401 || colsRes.status === 401) { router.push('/login'); return; }
    const itemsData = await itemsRes.json();
    const colsData = await colsRes.json();
    setItems(itemsData.items);
    setColumns(colsData.columns);
  }, [boardId, router]);

  async function addItem(parentId?: number) {
    const text = prompt('Item text');
    if (!text) return;
    const values: Record<number, string> = {};
    for (const col of columns) {
      const val = prompt(`Value for ${col.name}`) || '';
      values[col.id] = val;
    }
    await fetch(`/api/boards/${boardId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, parentId, values })
    });
    refresh();
  }

  async function addColumn() {
    const name = prompt('Column name');
    if (!name) return;
    await fetch(`/api/boards/${boardId}/columns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
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

  function renderRow(item: Item, indent = false) {
    return (
      <tr key={item.id} className={indent ? 'bg-gray-50' : undefined}>
        <td className="border px-2 py-1" style={{ paddingLeft: indent ? '2rem' : undefined }}>
          {item.text}
        </td>
        <td className="border px-2 py-1 cursor-pointer" onClick={() => cycleStatus(item)}>{item.status}</td>
        {columns.map(col => (
          <td key={col.id} className="border px-2 py-1">{item.values[col.id] || ''}</td>
        ))}
        <td className="border px-2 py-1 text-right text-sm space-x-2">
          <button onClick={() => addItem(item.id)} className="text-blue-600">Add Sub</button>
          <button onDoubleClick={() => deleteItem(item.id)} className="text-red-600">Delete</button>
        </td>
      </tr>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Items</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-2 py-1">Item</th>
            <th className="border px-2 py-1">Status</th>
            {columns.map(col => (
              <th key={col.id} className="border px-2 py-1">{col.name}</th>
            ))}
            <th className="border px-2 py-1"></th>
          </tr>
        </thead>
        <tbody>
          {items.filter(i => !i.parentId).map(item => (
            <>
              {renderRow(item)}
              {items.filter(s => s.parentId === item.id).map(sub => renderRow(sub, true))}
            </>
          ))}
        </tbody>
      </table>
      <div className="space-x-2">
        <button onClick={() => addItem()} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">Add Item</button>
        <button onClick={addColumn} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">Add Column</button>
      </div>
    </div>
  );
}
