// pages/usuarios.tsx
import React from "react";
import Link from "next/link";

const UsuariosPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 bg-slate-800 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Gestión de Usuarios
      </h1>
      <div className="flex justify-center gap-4">
        <Link href="/usuarios/view" legacyBehavior>
          <a className="bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded">
            Listado de Usuarios
          </a>
        </Link>
      </div>
    </div>
  );
};

export default UsuariosPage;
