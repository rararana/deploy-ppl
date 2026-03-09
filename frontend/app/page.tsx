import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <h1 className="text-3xl font-bold">Platform otomasi</h1>
      <Link href="/login">
        Login
      </Link>
    </main>
  );
}
