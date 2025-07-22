import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl">Thuesday - Monday Clone</h1>
      <p>
        <Link href="/login" className="text-blue-600">Login</Link> or {" "}
        <Link href="/register" className="text-blue-600">Register</Link>
      </p>
    </div>
  );
}
