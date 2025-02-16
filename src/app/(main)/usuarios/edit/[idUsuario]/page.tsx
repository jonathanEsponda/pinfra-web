"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  PerfilModelResponse,
  InstitucionModelResponse,
  UsuarioModelByIdAndModifyWithPhone,
  UsuarioModelByIdAndModify,
  TelefonoModelResponse,
} from "@/app/types";

export default function EditUsuarioPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<UsuarioModelByIdAndModifyWithPhone>();

  const { idUsuario } = useParams();

  const [perfiles, setPerfiles] = useState<PerfilModelResponse[]>([]);
  const [insti, setInsti] = useState<InstitucionModelResponse[]>([]);
  const [telefono, setTelefono] = useState<TelefonoModelResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Precargar datos del equipo a editar
  useEffect(() => {
    async function fetchUsuario() {
      try {
        // Usar el parámetro idUsuario ya extraído con useParams
        const res = await fetch(`/api/usuarios/${idUsuario}`);
        if (!res.ok) {
          throw new Error("Error al obtener el usuario");
        }
        const usuarioData: UsuarioModelByIdAndModifyWithPhone =
          await res.json();

        reset({
          ...usuarioData,
        });

        setLoading(true);
      } catch (error) {
        console.error(error);
      }
    }
    if (idUsuario) {
      fetchUsuario();
    }
  }, [idUsuario, reset]);

  // Obtener perfiles desde la API
  useEffect(() => {
    async function fetchPerfiles() {
      try {
        const res = await fetch("/api/perfiles");
        const data: PerfilModelResponse[] = await res.json();
        setPerfiles(data);
      } catch (error) {
        console.error("Error al obtener perfiles:", error);
      }
    }
    fetchPerfiles();
  }, []);

  // Obtener instituciones desde la API
  useEffect(() => {
    async function fetchInstituciones() {
      try {
        const res = await fetch("/api/instituciones");
        const data: InstitucionModelResponse[] = await res.json();
        setInsti(data);
      } catch (error) {
        console.error("Error al obtener instituciones:", error);
      }
    }
    fetchInstituciones();
  }, []);

  // Obtener telefono desde la API
  useEffect(() => {
    async function fetchTelefono() {
      try {
        const res = await fetch(`/api/telefonos/${idUsuario}`);
        const data: TelefonoModelResponse = await res.json();
        setTelefono(data);
      } catch (error) {
        console.error("Error al obtener instituciones:", error);
      }
    }
    fetchTelefono();
  }, [idUsuario]);

  const onSubmit = handleSubmit(
    async (data: UsuarioModelByIdAndModifyWithPhone) => {
      setErrorMessage(null); // Limpiar mensajes de error previos

      // Crear objeto estructurado según
      const usuarioData: UsuarioModelByIdAndModify = {
        id: data.id,
        cedula: data.cedula,
        primerNombre: data.primerNombre,
        segundoNombre: data.segundoNombre,
        primerApellido: data.primerApellido,
        segundoApellido: data.segundoApellido,
        fechaNacimiento: data.fechaNacimiento,
        nombreUsuario: data.nombreUsuario,
        email: data.email,
        idPerfil: data.idPerfil,
        idInstitucion: data.idInstitucion,
        activo: data.activo,
        estado: data.estado,
      };

      try {
        const res = await fetch("/api/usuarios", {
          method: "PUT",
          body: JSON.stringify(usuarioData),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          setErrorMessage(
            errorData.message || "Error al registrar el usuario."
          );
        }

        // Si el teléfono ha sido modificado, actualizarlo por separado
        // Comparamos el valor actual del formulario (data.telefono) con el que viene en el estado `telefono`
        if (data.telefono !== (telefono?.telefono || "")) {
          const telefonoData = {
            id: telefono?.id,
            telefono: data.telefono,
            idUsuario: data.id,
          };

          const resTelefono = await fetch("/api/telefonos", {
            method: "PUT",
            body: JSON.stringify(telefonoData),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!resTelefono.ok) {
            const errorTelefono = await resTelefono.json();
            throw new Error(
              errorTelefono.message || "Error al actualizar el teléfono."
            );
          }
        }

        router.push("/usuarios/view");
      } catch (error) {
        console.error("Error en la solicitud:", error);
        setErrorMessage(
          "Hubo un problema con la conexión. Inténtelo nuevamente."
        );
      }
    }
  );

  if (!loading || perfiles.length === 0 || insti.length === 0) {
    return (
      <div className="container mx-auto p-6 bg-slate-800 text-white rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-6 text-center">Editar Usuario</h1>
        <p>Cargando datos del usuario...</p>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-6 bg-slate-800 text-white rounded-lg shadow-lg">
      <form onSubmit={onSubmit} className="space-y-4">
        <h1 className="text-4xl font-bold mb-6 text-center">Editar Usuario</h1>

        {errorMessage && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <label
          htmlFor="primerNombre"
          className="text-slate-500 nb-2 block text-sm"
        >
          Primer nombre
        </label>
        <input
          type="text"
          className="w-full p-2 rounded bg-slate-700"
          {...register("primerNombre", {
            required: {
              value: true,
              message: "Primer nombre es obligatorio",
            },
            maxLength: { value: 30, message: "Máximo 30 caracteres" },
            pattern: {
              value: /^[A-Za-z]+$/,
              message: "Solo se permiten letras",
            },
          })}
        />
        {errors.primerNombre && (
          <span className="text-red-500 text-sm">
            {String(errors.primerNombre.message)}
          </span>
        )}

        <label
          htmlFor="segundoNombre"
          className="text-slate-500 nb-2 block text-sm"
        >
          Segundo nombre
        </label>
        <input
          type="text"
          {...register("segundoNombre", {
            required: {
              value: true,
              message: "Segundo nombre es obligatorio",
            },
            maxLength: { value: 30, message: "Máximo 30 caracteres" },
            pattern: {
              value: /^[A-Za-z]+$/,
              message: "Solo letras permitidas",
            },
          })}
          className="w-full p-2 rounded bg-slate-700"
        />
        {errors.segundoNombre && (
          <span className="text-red-500 text-sm">
            {String(errors.segundoNombre.message)}
          </span>
        )}

        <label
          htmlFor="primerApellido"
          className="text-slate-500 nb-2 block text-sm"
        >
          Primer apellido
        </label>
        <input
          type="text"
          {...register("primerApellido", {
            required: "El primer apellido es obligatorio",
            maxLength: { value: 30, message: "Máximo 30 caracteres" },
            pattern: {
              value: /^[A-Za-z]+$/,
              message: "Solo letras permitidas",
            },
          })}
          className="w-full p-2 rounded bg-slate-700"
        />
        {errors.primerApellido && (
          <span className="text-red-500 text-sm">
            {String(errors.primerApellido.message)}
          </span>
        )}

        <label
          htmlFor="segundoApellido"
          className="text-slate-500 nb-2 block text-sm"
        >
          Segundo apellido
        </label>
        <input
          type="text"
          {...register("segundoApellido", {
            required: {
              value: true,
              message: "Segundo apellido es obligatorio",
            },
            maxLength: { value: 30, message: "Máximo 30 caracteres" },
            pattern: {
              value: /^[A-Za-z]+$/,
              message: "Solo letras permitidas",
            },
          })}
          className="w-full p-2 rounded bg-slate-700"
        />
        {errors.segundoApellido && (
          <span className="text-red-500 text-sm">
            {String(errors.segundoApellido.message)}
          </span>
        )}

        <label htmlFor="cedula" className="text-slate-500 nb-2 block text-sm">
          Cedula
        </label>
        <input
          type="text"
          {...register("cedula", {
            required: { value: true, message: "Cédula es obligatorio" },
            pattern: {
              value: /^[0-9]+$/,
              message: "Solo se permiten números",
            },
            minLength: {
              value: 8,
              message: "La cédula debe tener 8 dígitos",
            },
            maxLength: {
              value: 8,
              message: "La cédula debe tener 8 dígitos",
            },
          })}
          maxLength={8}
          className="w-full p-2 rounded bg-slate-700"
        />
        {errors.cedula && (
          <span className="text-red-500 text-sm">
            {String(errors.cedula.message)}
          </span>
        )}

        <label
          htmlFor="fechaNacimiento"
          className="text-slate-500 nb-2 block text-sm"
        >
          Fecha de nacimiento
        </label>
        <input
          type="date"
          {...register("fechaNacimiento", {
            required: {
              value: true,
              message: "Fecha de nacimiento es obligatorio",
            },
          })}
          className="w-full p-2 rounded bg-slate-700"
        />
        {errors.fechaNacimiento && (
          <span className="text-red-500 text-sm">
            {String(errors.fechaNacimiento.message)}
          </span>
        )}

        <label htmlFor="telefono" className="text-slate-500 nb-2 block text-sm">
          Teléfono
        </label>
        <input
          defaultValue={telefono?.telefono || ""}
          type="text"
          {...register("telefono", {
            required: { value: true, message: "Teléfono es obligatorio" },
            pattern: {
              value: /^[0-9]+$/,
              message: "Solo se permiten números",
            },
            minLength: { value: 8, message: "Teléfono debe tener 8 dígitos" },
            maxLength: { value: 9, message: "Teléfono debe tener 8 dígitos" },
          })}
          className="w-full p-2 rounded bg-slate-700"
        />
        {errors.telefono && (
          <span className="text-red-500 text-sm">
            {String(errors.telefono.message)}
          </span>
        )}

        <label htmlFor="perfil" className="text-slate-500 nb-2 block text-sm">
          Perfil
        </label>
        <select
          {...register("idPerfil", {
            required: { value: true, message: "Perfil es obligatorio" },
          })}
          className="w-full p-2 rounded bg-slate-700"
        >
          <option value="">Seleccione un perfil</option>
          {perfiles.map((perfil) => (
            <option key={perfil.id} value={perfil.id}>
              {perfil.nombre}
            </option>
          ))}
        </select>
        {errors.idPerfil && (
          <span className="text-red-500 text-sm">
            {String(errors.idPerfil.message)}
          </span>
        )}

        <label
          htmlFor="institucion"
          className="text-slate-500 nb-2 block text-sm"
        >
          Institucion
        </label>
        <select
          {...register("idInstitucion", {
            required: { value: true, message: "Institución es obligatorio" },
          })}
          className="w-full p-2 rounded bg-slate-700"
        >
          <option value="">Seleccione una institución</option>
          {insti.map((inst) => (
            <option key={inst.id} value={inst.id}>
              {inst.nombre}
            </option>
          ))}
        </select>
        {errors.idInstitucion && (
          <span className="text-red-500 text-sm">
            {String(errors.idInstitucion.message)}
          </span>
        )}

        <label htmlFor="email" className="text-slate-500 nb-2 block text-sm">
          Email
        </label>
        <input
          type="email"
          {...register("email", {
            required: { value: true, message: "Email es obligatorio" },
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,7}$/,
              message: "Email inválido",
            },
          })}
          className="w-full p-2 rounded bg-slate-700"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">
            {String(errors.email.message)}
          </span>
        )}

        <label
          htmlFor="nombreUsuario"
          className="text-slate-500 nb-2 block text-sm"
        >
          Nombre de Usuario
        </label>
        <input
          {...register("nombreUsuario")}
          type="text"
          readOnly
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full opacity-50 cursor-not-allowed"
        />

        <label htmlFor="activo" className="text-slate-500 nb-2 block text-sm">
          Activo?
        </label>
        <input type="hidden" {...register("activo")} />
        <input
          value={watch("activo") ? "Activo" : "Eliminado"}
          type="text"
          readOnly
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full opacity-50 cursor-not-allowed"
        />

        <label htmlFor="estado" className="text-slate-500 nb-2 block text-sm">
          Estado
        </label>
        <select
          defaultValue={watch("estado")}
          {...register("estado")}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
        >
          <option value="NO_VERIFICADO">NO_VERIFICADO</option>
          <option value="VERIFICADO">VERIFICADO</option>
        </select>
        <button className="w-full bg-blue-500 text-white p-3 rounded-lg mt-2">
          Modificar usuario
        </button>
      </form>
    </div>
  );
}
