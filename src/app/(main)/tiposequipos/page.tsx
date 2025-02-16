"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TipoEquipoModelrequest } from "@/app/types";

const TiposEquiposPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TipoEquipoModelrequest>();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const routerNext = useRouter();

  const onSubmit = handleSubmit(async (data: TipoEquipoModelrequest) => {
    const tipoEquipoData: TipoEquipoModelrequest = {
      nombre: data.nombre,
    };

    try {
      const res = await fetch("/api/tiposEquipo", {
        method: "POST",
        body: JSON.stringify(tipoEquipoData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        setErrorMessage(
          errorData.message || "Error al registrar el tipo de Equipo."
        );
        return;
      }

      routerNext.push("/dashboard");
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setErrorMessage(
        "Hubo un problema con la conexión. Inténtelo nuevamente."
      );
    }
  });

  return (
    <div className="container mx-auto p-6 bg-slate-800 text-white rounded-lg shadow-lg max-w-md">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Ingresar nuevo Tipo de Equipo
      </h1>
      {errorMessage && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">
          {errorMessage}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <label htmlFor="nombre" className="block text-sm text-slate-500">
          Nombre
        </label>
        <input
          type="text"
          {...register("nombre", {
            required: "El nombre es obligatorio",
            maxLength: { value: 30, message: "Máximo 30 caracteres" },
          })}
          className="w-full p-2 rounded bg-slate-700"
          placeholder="Ingrese el nombre"
        />
        {errors.nombre && (
          <p className="text-red-500 text-sm">{errors.nombre.message}</p>
        )}
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default TiposEquiposPage;
