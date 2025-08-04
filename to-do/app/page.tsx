export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">To-Do-List</h1>
      <p className="text-lg text-gray-700 mb-6">Dashboard.</p>
      <div className="flex space-x-4">
        <a
          href="/signup"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Sign Up
        </a>
        <a
          href="/signin"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Sign In
        </a>
      </div>
    </main>
  );
}
