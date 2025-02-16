import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4 text-white">
        Sistema de Gestión de Hospitales
      </h1>
      <p className="text-xl mb-8 text-white">
        Bienvenido a la página principal del sistema de gestión de hospitales.
      </p>
      <Link href="/conoce-mas" className="text-white hover:underline">
        Conoce más
      </Link>
    </div>
  );
}
