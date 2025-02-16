"use client";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import omitBy from "lodash/omitBy";

import {
  FiltroUsuarioModel,
  UsuarioModelResponse,
  InstitucionModelResponse,
  PerfilModelResponse,
  UsuarioFiltroFormData,
} from "@/app/types";

const UsuariosView = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<UsuarioFiltroFormData>();

  // //Obtengo la fecha HOY para no perimitir que la fecha adquisición sea mayor
  // const today = new Date().toISOString().split("T")[0];

  const [usuarios, setUsuarios] = useState<UsuarioModelResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const [perfiles, setPerfiles] = useState<PerfilModelResponse[]>([]);
  const [
    ,
    //insti
    setInsti,
  ] = useState<InstitucionModelResponse[]>([]);

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

  const onSubmit = async (data: UsuarioFiltroFormData) => {
    const filtrarUsuario: FiltroUsuarioModel = {
      id: data.id ? Number(data.id) : undefined,
      cedula: data.cedula,
      primerNombre: data.primerNombre,
      segundoNombre: data.segundoNombre,
      primerApellido: data.primerApellido,
      segundoApellido: data.segundoApellido,
      nombreUsuario: data.nombreUsuario,
      email: data.email,
      perfil: data.idPerfil
        ? perfiles.find((p) => p.id === Number(data.idPerfil))?.nombre
        : undefined,

      estado: data.estado,
      activo:
        data.activo === "true"
          ? true
          : data.activo === "false"
          ? false
          : undefined,
    };

    // Filtra el objeto usando omitBy, para no enviar a la api valores nulos o ""
    const filteredData = omitBy(
      filtrarUsuario,
      (value) => value === null || value === undefined || value === ""
    );

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/usuarios/getUsuariosFiltrando", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filteredData),
      });

      const filteredUsuarios: UsuarioModelResponse[] = await res.json();

      // Enriquecer cada objeto consultando la API para obtener nombres
      const usuariosEnriquecidos = await Promise.all(
        filteredUsuarios.map(async (usuario) => {
          const nombrePerfilPromise = usuario.idPerfil
            ? fetch(`/api/perfiles/${usuario.idPerfil}`)
                .then((res) => {
                  if (!res.ok) {
                    throw new Error("Error al obtener el perfil");
                  }
                  return res.json();
                })
                .catch((err) => {
                  console.error("Error en perfil:", err);
                  return { nombre: "Desconocido" };
                })
            : Promise.resolve({ nombre: "" });

          const nombreInstiPromise = usuario.idInstitucion
            ? fetch(`/api/instituciones/${usuario.idInstitucion}`)
                .then((res) => {
                  if (!res.ok) {
                    throw new Error("Error al obtener Institucion");
                  }
                  return res.json();
                })
                .catch((err) => {
                  console.error("Error en Institucion:", err);
                  return { nombre: "Desconocido" };
                })
            : Promise.resolve({ nombre: "" });

          const [perfilData, institucionData] = await Promise.all([
            nombrePerfilPromise,
            nombreInstiPromise,
          ]);

          return {
            ...usuario,
            nombrePerfil: perfilData.nombre,
            nombreInstitucion: institucionData.nombre,
          };
        })
      );

      setUsuarios(usuariosEnriquecidos);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error al filtrar usuarios:", error.message);
        setError(error.message);
      } else {
        console.error("Error desconocido:", error);
        setError("Error desconocido al filtrar usuarios.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Activar Usuario
  const handleActivate = async (
    id: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    const confirmation = window.confirm(
      "¿Estás seguro de activar este usuario?"
    );
    if (!confirmation) return;

    try {
      const res = await fetch(`/api/usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Error al activar el usuario");
      }

      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario.id === id ? { ...usuario, activo: true } : usuario
        )
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        setError(error.message);
      } else {
        console.error("Error desconocido:", error);
        setError("No se pudo activar el usuario.");
      }
    }
  };

  // Eliminar Usuario
  const handleDelete = async (
    id: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    const confirmation = window.confirm(
      "¿Estás seguro de eliminar este usuario?"
    );
    if (!confirmation) return;

    try {
      const res = await fetch(`/api/usuarios/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Error al eliminar el usuario");
      }

      setUsuarios((prevUsuarios) =>
        prevUsuarios.filter((usuario) => usuario.id !== id)
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        setError(error.message);
      } else {
        console.error("Error desconocido:", error);
        setError("No se pudo eliminar el usuario.");
      }
    }
  };

  return (
    <div className="container mx-auto p-6 bg-slate-800 text-white rounded-lg shadow-lg">
      <div className="container mx-auto p-6 bg-slate-800 text-white rounded-lg shadow-lg">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* id */}
          <div className="flex flex-col">
            <label
              htmlFor="idInterno"
              className="text-slate-500 nb-2 block text-sm"
            >
              Identificador Interno
            </label>
            <input
              type="text"
              className="w-full p-2 rounded bg-slate-700"
              {...register("id", {
                maxLength: { value: 30, message: "Máximo 30 caracteres" },
              })}
            />
            {errors.id && (
              <span className="text-red-500 text-sm">
                {String(errors.id.message)}
              </span>
            )}
          </div>

          {/* cedula */}
          <div className="flex flex-col">
            <label
              htmlFor="cedula"
              className="text-slate-500 nb-2 block text-sm"
            >
              Cédula
            </label>
            <input
              type="text"
              className="w-full p-2 rounded bg-slate-700"
              {...register("cedula", {
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
            />
            {errors.cedula && (
              <span className="text-red-500 text-sm">
                {String(errors.cedula.message)}
              </span>
            )}
          </div>

          {/* Primer Nombre */}
          <div className="flex flex-col">
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
                maxLength: { value: 30, message: "Máximo 30 caracteres" },
              })}
            />
            {errors.primerNombre && (
              <span className="text-red-500 text-sm">
                {String(errors.primerNombre.message)}
              </span>
            )}
          </div>

          {/* Segundo Nombre */}
          <div className="flex flex-col">
            <label
              htmlFor="segundoNombre"
              className="text-slate-500 nb-2 block text-sm"
            >
              Segundo nombre
            </label>
            <input
              type="text"
              className="w-full p-2 rounded bg-slate-700"
              {...register("segundoNombre", {
                maxLength: { value: 30, message: "Máximo 30 caracteres" },
              })}
            />
            {errors.segundoNombre && (
              <span className="text-red-500 text-sm">
                {String(errors.segundoNombre.message)}
              </span>
            )}
          </div>

          {/* Primer apellido */}
          <div className="flex flex-col">
            <label
              htmlFor="primerApellido"
              className="text-slate-500 nb-2 block text-sm"
            >
              Primer apellido
            </label>
            <input
              type="text"
              className="w-full p-2 rounded bg-slate-700"
              {...register("primerApellido", {
                maxLength: { value: 30, message: "Máximo 30 caracteres" },
              })}
            />
            {errors.primerApellido && (
              <span className="text-red-500 text-sm">
                {String(errors.primerApellido.message)}
              </span>
            )}
          </div>

          {/* Segundo apellido */}
          <div className="flex flex-col">
            <label
              htmlFor="segundoapellido"
              className="text-slate-500 nb-2 block text-sm"
            >
              Segundo apellido
            </label>
            <input
              type="text"
              className="w-full p-2 rounded bg-slate-700"
              {...register("segundoApellido", {
                maxLength: { value: 30, message: "Máximo 30 caracteres" },
              })}
            />
            {errors.segundoApellido && (
              <span className="text-red-500 text-sm">
                {String(errors.segundoApellido.message)}
              </span>
            )}
          </div>

          {/* Perfil */}
          <div className="flex flex-col">
            <label
              htmlFor="perfil"
              className="text-slate-500 nb-2 block text-sm"
            >
              Perfil
            </label>
            <select
              {...register("idPerfil")}
              className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
            >
              <option value="">Seleccione el Perfil</option>
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
          </div>

          {/* Nombre de usuario */}
          <div className="flex flex-col">
            <label
              htmlFor="numbreUsuario"
              className="text-slate-500 nb-2 block text-sm"
            >
              Nombre de usuario
            </label>
            <input
              type="text"
              className="w-full p-2 rounded bg-slate-700"
              {...register("nombreUsuario", {
                maxLength: { value: 30, message: "Máximo 30 caracteres" },
              })}
            />
            {errors.nombreUsuario && (
              <span className="text-red-500 text-sm">
                {String(errors.nombreUsuario.message)}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-slate-500 nb-2 block text-sm"
            >
              Email
            </label>
            <input
              type="text"
              className="w-full p-2 rounded bg-slate-700"
              {...register("email", {
                maxLength: { value: 30, message: "Máximo 30 caracteres" },
              })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {String(errors.email.message)}
              </span>
            )}
          </div>

          {/* Estado */}
          <div className="flex flex-col">
            <label
              htmlFor="estado"
              className="text-slate-500 nb-2 block text-sm"
            >
              Estado
            </label>
            <select
              {...register("estado")}
              className="p-2 rounded bg-slate-700"
            >
              <option value="">Seleccionar</option>
              <option value="VERIFICADO">VERIFICADO</option>
              <option value="NO_VERIFICADO">NO VERIFICADO</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-slate-500 nb-2 block text-sm">
              Filtrar por estado
            </label>
            <Controller
              control={control}
              name="activo"
              defaultValue="" // Valor vacío -> sin filtro
              render={({ field }) => (
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value=""
                      checked={field.value === ""}
                      onChange={() => field.onChange("")}
                      className="mr-1"
                    />
                    Sin filtro
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="true"
                      checked={field.value === "true"}
                      onChange={() => field.onChange("true")}
                      className="mr-1"
                    />
                    Activo
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="false"
                      checked={field.value === "false"}
                      onChange={() => field.onChange("false")}
                      className="mr-1"
                    />
                    Eliminado
                  </label>
                </div>
              )}
            />
          </div>

          {/* Botón para limpiar filtros */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="button"
              onClick={() =>
                reset({
                  id: "",
                  primerNombre: "",
                  segundoNombre: "",
                  primerApellido: "",
                  segundoApellido: "",
                  idPerfil: "",
                  nombreUsuario: "",
                  email: "",
                  estado: "",
                  activo: "",
                })
              }
              className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Limpiar filtros
            </button>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 rounded hover:bg-blue-600"
            >
              Filtrar
            </button>
          </div>
        </form>
      </div>
      <h1 className="text-4xl font-bold mb-6 text-center">
        Listado de usuarios
      </h1>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b-2 py-3 px-4">ID</th>
              <th className="border-b-2 py-3 px-4">Cedula</th>
              <th className="border-b-2 py-3 px-4">Primer nombre</th>
              <th className="border-b-2 py-3 px-4">Primer apellido</th>
              <th className="border-b-2 py-3 px-4">Fecha nacimiento</th>
              <th className="border-b-2 py-3 px-4">Institución</th>
              <th className="border-b-2 py-3 px-4">Perfil</th>
              <th className="border-b-2 py-3 px-4">Nombre de usuario</th>
              <th className="border-b-2 py-3 px-4">Email</th>
              <th className="border-b-2 py-3 px-4">Estado</th>
              <th className="border-b-2 py-3 px-4">Activo?</th>
              <th colSpan={3} className="border-b-2 py-3 px-4 text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-slate-700">
                <td className="py-3 px-4 border-b">{usuario.id}</td>
                <td className="py-3 px-4 border-b">{usuario.cedula}</td>
                <td className="py-3 px-4 border-b">{usuario.primerNombre}</td>
                <td className="py-3 px-4 border-b">{usuario.primerApellido}</td>
                <td className="py-3 px-4 border-b">
                  {usuario.fechaNacimiento}
                </td>
                <td className="py-3 px-4 border-b">
                  {usuario.nombreInstitucion}
                </td>
                <td className="py-3 px-4 border-b">{usuario.nombrePerfil}</td>
                <td className="py-3 px-4 border-b">{usuario.nombreUsuario}</td>
                <td className="py-3 px-4 border-b">{usuario.email}</td>
                <td className="py-3 px-4 border-b">{usuario.estado}</td>
                <td className="py-3 px-4 border-b">
                  {usuario.activo ? "Activo" : "Eliminado"}
                </td>

                <td className="py-3 px-4 border-b">
                  <button
                    onClick={(e) => handleActivate(usuario.id, e)}
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Activar
                  </button>
                </td>
                <td className="py-3 px-4 border-b">
                  <button
                    onClick={() => router.push(`/usuarios/edit/${usuario.id}`)}
                    className="mr-2 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    Modificar
                  </button>
                  <br />
                </td>
                <td className="py-3 px-4 border-b">
                  <button
                    onClick={(e) => handleDelete(usuario.id, e)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsuariosView;
