"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PerfilModelResponse,
  AltaUsuarioModel,
  AltaUsuarioFormModel,
  InstitucionModelResponse,
} from "@/app/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AltaUsuarioFormModel>();

  const [perfiles, setPerfiles] = useState<PerfilModelResponse[]>([]);
  const [insti, setInsti] = useState<InstitucionModelResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

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

  // Construir nombre usuario
  const primerNombre = watch("usuario.primerNombre", "");
  const primerApellido = watch("usuario.primerApellido", "");
  const nombreUsuario =
    primerNombre && primerApellido
      ? `${primerNombre}.${primerApellido}`.toLowerCase()
      : "";

  const onSubmit = handleSubmit(async (data) => {
    setErrorMessage(null);

    // Crear objeto estructurado según AltaUsuarioModel
    const usuarioData: AltaUsuarioModel = {
      usuario: {
        cedula: data.usuario.cedula,
        primerNombre: data.usuario.primerNombre,
        segundoNombre: data.usuario.segundoNombre,
        primerApellido: data.usuario.primerApellido,
        segundoApellido: data.usuario.segundoApellido,
        fechaNacimiento: data.usuario.fechaNacimiento,
        nombreUsuario: nombreUsuario,
        email: data.usuario.email,
        idPerfil: data.usuario.idPerfil,
        idInstitucion: data.usuario.idInstitucion,
      },
      contrasenia: data.contrasenia,
      telefono: data.telefono,
    };

    console.log("UsuarioData: ", usuarioData);
    try {
      const res = await fetch("/api/auth/registro", {
        method: "POST",
        body: JSON.stringify(usuarioData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.message || "Error al registrar el usuario.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setErrorMessage(
        "Hubo un problema con la conexión. Inténtelo nuevamente."
      );
    }
  });

  return (
    <div className="mx-auto w-1/2 p-6 bg-slate-800 text-white rounded-lg shadow-lg">
      <form onSubmit={onSubmit} className="space-y-4">
        <h1 className="text-4xl font-bold mb-6 text-center">Registro</h1>

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
          value={primerNombre}
          {...register("usuario.primerNombre", {
            required: { value: true, message: "Primer nombre es obligatorio" },
            maxLength: { value: 30, message: "Máximo 30 caracteres" },
            pattern: {
              value: /^[A-Za-z]+$/,
              message: "Solo se permiten letras",
            },
          })}
        />
        {errors.usuario?.primerNombre && (
          <span className="text-red-500 text-sm">
            {String(errors.usuario.primerNombre.message)}
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
          {...register("usuario.segundoNombre", {
            required: "El segundo nombre es obligatorio",
            maxLength: { value: 30, message: "Máximo 30 caracteres" },
            pattern: {
              value: /^[A-Za-z]+$/,
              message: "Solo letras permitidas",
            },
          })}
          className="w-full p-2 rounded bg-slate-700"
        />
        {errors.usuario?.segundoNombre && (
          <span className="text-red-500 text-sm">
            {String(errors.usuario.segundoNombre.message)}
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
          {...register("usuario.primerApellido", {
            required: "El primer apellido es obligatorio",
            maxLength: { value: 30, message: "Máximo 30 caracteres" },
            pattern: {
              value: /^[A-Za-z]+$/,
              message: "Solo letras permitidas",
            },
          })}
          className="w-full p-2 rounded bg-slate-700"
        />
        {errors.usuario?.primerApellido && (
          <span className="text-red-500 text-sm">
            {String(errors.usuario.primerApellido.message)}
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
          {...register("usuario.segundoApellido", {
            required: "El segundo apellido es obligatorio",
            maxLength: { value: 30, message: "Máximo 30 caracteres" },
            pattern: {
              value: /^[A-Za-z]+$/,
              message: "Solo letras permitidas",
            },
          })}
          className="w-full p-2 rounded bg-slate-700"
        />
        {errors.usuario?.segundoApellido && (
          <span className="text-red-500 text-sm">
            {String(errors.usuario.segundoApellido.message)}
          </span>
        )}

        <label htmlFor="cedula" className="text-slate-500 nb-2 block text-sm">
          Cedula
        </label>
        <input
          type="text"
          {...register("usuario.cedula", {
            required: { value: true, message: "Cédula es obligatorio" },
            pattern: { value: /^[0-9]+$/, message: "Solo se permiten números" },
            minLength: { value: 8, message: "La cédula debe tener 8 dígitos" },
            maxLength: { value: 8, message: "La cédula debe tener 8 dígitos" },
          })}
          maxLength={8}
          className="w-full p-2 rounded bg-slate-700"
        />
        {errors.usuario?.cedula && (
          <span className="text-red-500 text-sm">
            {String(errors.usuario.cedula.message)}
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
          {...register("usuario.fechaNacimiento", {
            required: {
              value: true,
              message: "Fecha de nacimiento es obligatorio",
            },
          })}
          className="w-full p-2 rounded bg-slate-700"
        />
        {errors.usuario?.fechaNacimiento && (
          <span className="text-red-500 text-sm">
            {String(errors.usuario.fechaNacimiento.message)}
          </span>
        )}

        <label htmlFor="telefono" className="text-slate-500 nb-2 block text-sm">
          Teléfono
        </label>
        <input
          type="text"
          {...register("telefono", {
            required: { value: true, message: "Teléfono es obligatorio" },
            pattern: { value: /^[0-9]+$/, message: "Solo se permiten números" },
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
          {...register("usuario.idPerfil", {
            required: { value: true, message: "Perfil es obligatorio" },
          })}
          className="w-full p-2 rounded bg-slate-700"
        >
          <option value="">Seleccione un perfil</option>
          {perfiles
            .filter((perfil) => perfil.id >= 2) //No se muestra el perfil administrador
            .map((perfil) => (
              <option key={perfil.id} value={perfil.id}>
                {perfil.nombre}
              </option>
            ))}
        </select>
        {errors.usuario?.idPerfil && (
          <span className="text-red-500 text-sm">
            {String(errors.usuario.idPerfil.message)}
          </span>
        )}

        <label
          htmlFor="institucion"
          className="text-slate-500 nb-2 block text-sm"
        >
          Institucion
        </label>
        <select
          {...register("usuario.idInstitucion", {
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
        {errors.usuario?.idInstitucion && (
          <span className="text-red-500 text-sm">
            {String(errors.usuario.idInstitucion.message)}
          </span>
        )}

        <label htmlFor="email" className="text-slate-500 nb-2 block text-sm">
          Email
        </label>
        <input
          type="email"
          {...register("usuario.email", {
            required: { value: true, message: "Email es obligatorio" },
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,7}$/,
              message: "Email inválido",
            },
          })}
          className="w-full p-2 rounded bg-slate-700"
        />
        {errors.usuario?.email && (
          <span className="text-red-500 text-sm">
            {String(errors.usuario.email.message)}
          </span>
        )}

        <label
          htmlFor="nombreUsuario"
          className="text-slate-500 nb-2 block text-sm"
        >
          Nombre de Usuario
        </label>
        <input
          type="text"
          id="nombreUsuario"
          value={nombreUsuario}
          readOnly
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full opacity-50 cursor-not-allowed"
        />

        <label htmlFor="password" className="text-slate-500 nb-2 block text-sm">
          Contraseña
        </label>
        <input
          type="password"
          {...register("contrasenia", {
            required: {
              value: true,
              message: "Contraseña es obligatorio",
            },
            minLength: {
              value: 8,
              message: "La contraseña debe contener al menos 8 caracteres",
            },
          })}
          className="w-full p-2 rounded bg-slate-700"
        />
        {errors.contrasenia && (
          <span className="text-red-500 text-sm">
            {String(errors.contrasenia.message)}
          </span>
        )}

        <label
          htmlFor="confirmPassword"
          className="text-slate-500 nb-2 block text-sm"
        >
          Confirmar contraseña
        </label>
        <input
          type="password"
          {...register("confirmarContrasenia", {
            required: {
              value: true,
              message: "Confirmar contraseña es obligatorio",
            },
            validate: (value) =>
              value === watch("contrasenia") || "Las contraseñas no coinciden",
          })}
          className="w-full p-2 rounded bg-slate-700"
        />
        {errors.confirmarContrasenia && (
          <span className="text-red-500 text-sm">
            {String(errors.confirmarContrasenia.message)}
          </span>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="w-full bg-blue-500 text-white p-3 rounded-lg mt-2">
              Registrarse
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-slate-800 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Al registrarte, se creará tu cuenta con los datos ingresados.
                Confirma que deseas continuar.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-600 text-white px-3 py-1 rounded">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onSubmit()}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
      <div className="mt-5 items-center">
        <p>¿Ya tienes una cuenta?</p>
        <p>
          <a href="/login">Iniciar Sesión</a>
        </p>
      </div>
    </div>
  );
}
