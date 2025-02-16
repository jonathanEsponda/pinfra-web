"use client";

import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { BajaEquipoFormModel, BajaEquipoModel } from "@/app/types";

export default function BajaEquipoFormPage() {
  const router = useRouter();
  const { idEquipo } = useParams();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BajaEquipoFormModel>();

  useEffect(() => {
    if (idEquipo) {
      const fetchEquipo = async () => {
        try {
          const res = await fetch(`/api/equipos/${idEquipo}`);
          if (!res.ok) {
            throw new Error("Error al obtener los datos del equipo");
          }
          const equipoData = await res.json();
          setValue("nombre", equipoData.nombre);
          setValue("idEquipo", Number(idEquipo));
        } catch (error) {
          console.error("Error al cargar el equipo:", error);
        }
      };
      fetchEquipo();
    }
  }, [idEquipo, setValue]);

  useEffect(() => {
    if (session?.user?.id) {
      setValue("idUsuario", session.user.id);
    }
  }, [session, setValue]);

  const onSubmit = async (data: BajaEquipoFormModel) => {
    let fechaConSegundos = data.fecha;
    if (fechaConSegundos && fechaConSegundos.length === 16) {
      fechaConSegundos += ":00";
    }

    const bajaEquipo: BajaEquipoModel = {
      fecha: fechaConSegundos,
      razon: data.razon,
      comentarios: data.comentarios,
      idUsuario: Number(data.idUsuario),
      idEquipo: data.idEquipo,
    };

    try {
      const res = await fetch("/api/equipos/bajaEquipo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bajaEquipo),
      });

      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || "Error al enviar datos");
      }
      router.push("/equipos/view");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error al borrar el equipo:", error.message);
      } else {
        console.error("Error al borrar el equipo:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 bg-slate-800 text-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Registrar Baja de Equipo
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* ID Equipo */}
        <div>
          <label className="block mb-1">ID Equipo</label>
          <input
            type="number"
            {...register("idEquipo", {
              required: "El ID del equipo es obligatorio",
              valueAsNumber: true,
            })}
            className="w-full p-2 rounded bg-slate-700"
            readOnly
          />
          {errors.idEquipo && (
            <span className="text-red-500">{errors.idEquipo.message}</span>
          )}
        </div>

        {/* Nombre del Equipo */}
        <div>
          <label className="block mb-1">Nombre del Equipo</label>
          <input
            type="text"
            {...register("nombre", { required: "El nombre es obligatorio" })}
            className="w-full p-2 rounded bg-slate-700"
            readOnly
          />
          {errors.nombre && (
            <span className="text-red-500">{errors.nombre.message}</span>
          )}
        </div>

        {/* Fecha */}
        <div>
          <label className="block mb-1">Fecha</label>
          <input
            type="datetime-local"
            {...register("fecha", {
              required: "La fecha es obligatoria",
            })}
            className="w-full p-2 rounded bg-slate-700"
          />
          {errors.fecha && (
            <span className="text-red-500">{errors.fecha.message}</span>
          )}
        </div>

        {/* Razón */}
        <div>
          <label className="block mb-1">Razón</label>
          <input
            type="text"
            {...register("razon", {
              required: "La razón es obligatoria",
            })}
            className="w-full p-2 rounded bg-slate-700"
          />
          {errors.razon && (
            <span className="text-red-500">{errors.razon.message}</span>
          )}
        </div>

        {/* Comentarios */}
        <div>
          <label className="block mb-1">Comentarios</label>
          <textarea
            {...register("comentarios", {
              required: "Los comentarios son obligatorios",
            })}
            className="w-full p-2 rounded bg-slate-700"
          />
          {errors.comentarios && (
            <span className="text-red-500">{errors.comentarios.message}</span>
          )}
        </div>

        {/* ID Usuario */}
        <div>
          <label className="block mb-1">ID Usuario</label>
          <input
            type="number"
            {...register("idUsuario", {
              required: "El ID de usuario es obligatorio",
              valueAsNumber: true,
            })}
            className="w-full p-2 rounded bg-slate-700"
            readOnly
          />
          {errors.idUsuario && (
            <span className="text-red-500">{errors.idUsuario.message}</span>
          )}
        </div>

        {/* Botón de envío */}
        <div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 rounded hover:bg-blue-600"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
