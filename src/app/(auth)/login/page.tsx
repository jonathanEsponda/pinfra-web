"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", {
      username,
      password,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className="flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-lg bg-slate-800 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Iniciar Sesión
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo de nombre de usuario */}
          <div>
            <label htmlFor="username" className="block text-gray-200 mb-1">
              Nombre de Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          {/* Campo de contraseña */}
          <div>
            <label htmlFor="password" className="block text-gray-200 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          {/* Botones de acción */}
          <div className="flex flex-col gap-4 mt-6">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl"
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl"
            >
              Iniciar Sesión con Google
            </button>
            <Link
              href="/registro"
              className="w-full block text-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl"
            >
              Registrarse
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
