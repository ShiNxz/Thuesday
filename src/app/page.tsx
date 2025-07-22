import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-6 space-y-4 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold">Thuesday - Monday Clone</h1>
      <p>
        <Link href="/login" className="text-blue-600 hover:underline">Login</Link> or{' '}
        <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
      </p>
    </div>
  );
}
