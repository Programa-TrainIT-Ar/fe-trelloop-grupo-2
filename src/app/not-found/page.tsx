export default function NotFoundPage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-lg">Página no encontrada</p>
      <a
        href="/home"
        className="mt-6 bg-purple-600 px-6 py-2 rounded-lg text-white hover:bg-purple-700"
      >
        Volver al inicio
      </a>
    </div>
  );
}