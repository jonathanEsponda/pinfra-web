"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  //Agregar mensaje o un link para iniciar sesión.
  if (!session) return null;

  // si el usuario se autenticó con Google, no tiene un idPerfil.
  const isGoogle = !session.user.idPerfil;
  const idPerfil = session.user.idPerfil;

  return (
    <nav className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Siempre mostrar Dashboard */}
        <Link href="/dashboard" className="hover:underline">
          Dashboard
        </Link>

        {/* Si el usuario se autenticó con credenciales */}
        {!isGoogle && idPerfil && (
          <>
            {/* Administrador: gestionar usuarios y equipos */}
            {idPerfil === 1 && (
              <>
                <Link href="/usuarios/gestion" className="hover:underline">
                  Gestión de Usuarios
                </Link>
                <Link href="/equipos/gestion" className="hover:underline">
                  Gestión de Equipos
                </Link>
              </>
            )}

            {/* Auxiliar Administrativo: gestionar usuarios, equipos y tipos de equipos */}
            {idPerfil === 2 && (
              <>
                <Link href="/usuarios/gestion" className="hover:underline">
                  Gestión de Usuarios
                </Link>
                <Link href="/equipos/gestion" className="hover:underline">
                  Gestión de Equipos
                </Link>
                <Link href="/tiposequipos" className="hover:underline">
                  Gestión de Tipos de Equipos
                </Link>
              </>
            )}

            {/* Otros usuarios con credenciales: solo gestión de equipos */}
            {idPerfil !== 1 && idPerfil !== 2 && (
              <Link href="/equipos/gestion" className="hover:underline">
                Gestión de Equipos
              </Link>
            )}

            {/* Link para modificar datos personales (para todos los usuarios con credenciales) */}
            <Link href="/perfil/modificar" className="hover:underline">
              Modificar Datos Personales
            </Link>
          </>
        )}

        {/* Si el usuario se autenticó con Google, mostramos solo Dashboard y modificar perfil */}
        {isGoogle && (
          <>
            <Link href="/perfil/modificar" className="hover:underline">
              Modificar Datos Personales
            </Link>
          </>
        )}
      </div>
      <div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}
