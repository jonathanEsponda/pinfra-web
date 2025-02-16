"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  RegistroEquipoFormModel,
  ModificarEquipoModel,
  TipoEquipoModelResponse,
  MarcaModelResponse,
  ModeloModelResponse,
  PaisModelResponse,
  ProveedorModelResponse,
  UbicacionModelResponse,
  GarantiaModel,
  GarantiaFormModel,
} from "@/app/types";

export default function EditEquipoPage() {
  // Extraemos el parámetro (asegúrate de que en la ruta esté definido, por ejemplo: app/equipos/edit/[idEquipo]/page.tsx)
  const { idEquipo } = useParams();
  const router = useRouter();

  // Para limitar la fecha de adquisición a hoy o anteriores
  const today = new Date().toISOString().split("T")[0];

  // Configuramos react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<RegistroEquipoFormModel>();

  // Estados para cargar las opciones (tipos, marcas, etc.) tal como en la página de creación
  const [tiposEquipos, setTiposEquipo] = useState<TipoEquipoModelResponse[]>(
    []
  );
  const [marcas, setMarcas] = useState<MarcaModelResponse[]>([]);
  const [modelos, setModelos] = useState<ModeloModelResponse[]>([]);
  const [paises, setPaises] = useState<PaisModelResponse[]>([]);
  const [prov, setProv] = useState<ProveedorModelResponse[]>([]);
  const [ubicaciones, setUbicaciones] = useState<UbicacionModelResponse[]>([]);

  const [loading, setLoading] = useState(false);

  // Precargar datos del equipo a editar
  useEffect(() => {
    async function fetchEquipo() {
      try {
        // Usar el parámetro idEquipo ya extraído con useParams
        const res = await fetch(`/api/equipos/${idEquipo}`);
        if (!res.ok) {
          throw new Error("Error al obtener el equipo");
        }
        const equipoData: RegistroEquipoFormModel = await res.json();

        const lifetime = "lifetime";
        const duration = "duration";

        const garantiaFormData: GarantiaFormModel = {
          ...equipoData.garantia,
          tipo: equipoData.garantia.dePorVida
            ? (lifetime as "lifetime")
            : (duration as "duration"),
        };

        reset({
          ...equipoData,
          garantia: garantiaFormData,
        });

        setLoading(true);
      } catch (error) {
        console.error(error);
      }
    }
    if (idEquipo) {
      fetchEquipo();
    }
  }, [idEquipo, reset]);

  // Cargar opciones de selección (igual que en la página de creación)
  useEffect(() => {
    async function fetchTiposEquipo() {
      try {
        const res = await fetch("/api/tiposEquipo");
        const data: TipoEquipoModelResponse[] = await res.json();
        setTiposEquipo(data);
      } catch (error) {
        console.error("Error al obtener Tipos de equipo:", error);
      }
    }
    fetchTiposEquipo();
  }, []);

  useEffect(() => {
    async function fetchPaises() {
      try {
        const res = await fetch("/api/paises");
        const data: PaisModelResponse[] = await res.json();
        setPaises(data);
      } catch (error) {
        console.error("Error al obtener países:", error);
      }
    }
    fetchPaises();
  }, []);

  useEffect(() => {
    async function fetchProveedores() {
      try {
        const res = await fetch("/api/proveedores");
        const data: ProveedorModelResponse[] = await res.json();
        setProv(data);
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
      }
    }
    fetchProveedores();
  }, []);

  useEffect(() => {
    async function fetchUbicaciones() {
      try {
        const res = await fetch("/api/ubicaciones");
        const data: UbicacionModelResponse[] = await res.json();
        setUbicaciones(data);
      } catch (error) {
        console.error("Error al obtener ubicaciones:", error);
      }
    }
    fetchUbicaciones();
  }, []);

  useEffect(() => {
    async function fetchMarcas() {
      try {
        const res = await fetch("/api/marcas");
        const data: MarcaModelResponse[] = await res.json();
        setMarcas(data);
      } catch (error) {
        console.error("Error al obtener marcas:", error);
      }
    }
    fetchMarcas();
  }, []);

  // Observar el valor seleccionado en el combo de marcas para cargar modelos
  const selectedMarca = watch("idMarca");

  useEffect(() => {
    async function fetchModelosPorMarca(idMarca: string) {
      try {
        const res = await fetch(`/api/modelos/getPorMarca/${idMarca}`);
        const data: ModeloModelResponse[] = await res.json();
        setModelos(data);
      } catch (error) {
        console.error("Error al obtener modelos:", error);
      }
    }
    if (selectedMarca) {
      fetchModelosPorMarca(selectedMarca.toString());
    } else {
      setModelos([]);
    }
  }, [selectedMarca]);

  // Observar la opción elegida para la garantía
  const tipoGarantia = watch("garantia.tipo");

  // Para el manejo del envío del formulario
  const onSubmit = async (data: RegistroEquipoFormModel) => {
    // Si se selecciona garantía de por vida, se asignan los valores correspondientes
    if (data.garantia.tipo === "lifetime") {
      data.garantia.dePorVida = true;
      data.garantia.anios = 0;
      data.garantia.meses = 0;
      data.garantia.dias = 0;
    } else {
      data.garantia.dePorVida = false;
    }
    const garantia: GarantiaModel = {
      anios: data.garantia.anios,
      meses: data.garantia.meses,
      dias: data.garantia.dias,
      dePorVida: data.garantia.dePorVida,
    };

    const equipo: ModificarEquipoModel = {
      id: Number(idEquipo),
      nombre: data.nombre,
      idTipoEquipo: data.idTipoEquipo,
      idMarca: data.idMarca,
      idModelo: data.idModelo,
      numSerie: data.numSerie,
      idPaisOrigen: data.idPaisOrigen,
      idProveedor: data.idProveedor,
      fechaAdquisicion: data.fechaAdquisicion,
      garantia: garantia,
      idUbicacionActual: data.idUbicacionActual,
      idBajaEquipo: "",
      fechaExpiracionGarantia: "",
    };

    try {
      const res = await fetch(`/api/equipos/${idEquipo}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(equipo),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al actualizar el equipo");
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

  // Muestra un mensaje de carga mientras se espera la sesión o la respuesta de la API
  if (
    !loading ||
    tiposEquipos.length === 0 ||
    paises.length === 0 ||
    prov.length === 0 ||
    ubicaciones.length === 0 ||
    marcas.length === 0 ||
    (selectedMarca && modelos.length === 0)
  ) {
    return (
      <div className="mx-auto w-1/2 p-6 bg-slate-800 text-white rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-6 text-center">Editar Equipo</h1>
        <p>Cargando datos del equipo...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-slate-800 text-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-6 text-center">Editar Equipo</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* ID */}
        <div>
          <label className="block mb-1">Identificador interno</label>
          <input
            type="text"
            value={idEquipo}
            className="w-full p-2 rounded bg-slate-700"
            readOnly
          />
          {errors.nombre && (
            <span className="text-red-500 text-sm">
              {errors.nombre.message}
            </span>
          )}
        </div>

        {/* Nombre */}
        <div>
          <label className="block mb-1">Nombre</label>
          <input
            type="text"
            {...register("nombre", {
              required: { value: true, message: "Nombre es obligatorio" },
              maxLength: { value: 30, message: "Máximo 30 caracteres" },
            })}
            className="w-full p-2 rounded bg-slate-700"
          />
          {errors.nombre && (
            <span className="text-red-500 text-sm">
              {errors.nombre.message}
            </span>
          )}
        </div>

        {/* Tipo Equipo */}
        <label className="text-slate-500 nb-2 block text-sm">
          Tipo de equipo
        </label>
        <select
          {...register("idTipoEquipo", {
            required: { value: true, message: "Tipo de equipo es obligatorio" },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
        >
          <option value="">Seleccione el tipo de Equipo</option>
          {tiposEquipos.map((tE) => (
            <option key={tE.id} value={tE.id}>
              {tE.nombre}
            </option>
          ))}
        </select>
        {errors.idTipoEquipo && (
          <span className="text-red-500 text-sm">
            {String(errors.idTipoEquipo.message)}
          </span>
        )}

        {/* Marca */}
        <label className="text-slate-500 nb-2 block text-sm">Marca</label>
        <select
          {...register("idMarca", {
            required: { value: true, message: "Marca es obligatorio" },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
        >
          <option value="">Seleccione la marca</option>
          {marcas.map((marca) => (
            <option key={marca.id} value={marca.id}>
              {marca.nombre}
            </option>
          ))}
        </select>
        {errors.idMarca && (
          <span className="text-red-500 text-sm">
            {String(errors.idMarca.message)}
          </span>
        )}

        {/* Modelo */}
        <label className="text-slate-500 nb-2 block text-sm">Modelo</label>
        <select
          {...register("idModelo", {
            required: { value: true, message: "Modelo es obligatorio" },
          })}
          defaultValue=""
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
        >
          <option value="">
            {selectedMarca
              ? "Seleccione el modelo"
              : "Seleccione la marca primero"}
          </option>
          {modelos.map((modelo) => (
            <option key={modelo.id} value={modelo.id}>
              {modelo.nombre}
            </option>
          ))}
        </select>
        {errors.idModelo && (
          <span className="text-red-500 text-sm">
            {String(errors.idModelo.message)}
          </span>
        )}

        {/* Número de Serie */}
        <div>
          <label className="block mb-1">Número de Serie</label>
          <input
            type="text"
            {...register("numSerie", {
              required: {
                value: true,
                message: "Número de serie es obligatorio",
              },
              maxLength: { value: 30, message: "Máximo 30 caracteres" },
            })}
            className="w-full p-2 rounded bg-slate-700"
          />
          {errors.numSerie && (
            <span className="text-red-500 text-sm">
              {errors.numSerie.message}
            </span>
          )}
        </div>

        {/* País de Origen */}
        <label className="text-slate-500 nb-2 block text-sm">
          País de origen
        </label>
        <select
          {...register("idPaisOrigen", {
            required: { value: true, message: "País de origen es obligatorio" },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
        >
          <option value="">Seleccione el país de origen</option>
          {paises.map((pais) => (
            <option key={pais.id} value={pais.id}>
              {pais.nombre}
            </option>
          ))}
        </select>
        {errors.idPaisOrigen && (
          <span className="text-red-500 text-sm">
            {String(errors.idPaisOrigen.message)}
          </span>
        )}

        {/* Proveedor */}
        <label className="text-slate-500 nb-2 block text-sm">Proveedor</label>
        <select
          {...register("idProveedor", {
            required: { value: true, message: "Proveedor es obligatorio" },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
        >
          <option value="">Seleccione el proveedor</option>
          {prov.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
        {errors.idProveedor && (
          <span className="text-red-500 text-sm">
            {String(errors.idProveedor.message)}
          </span>
        )}

        {/* Fecha de Adquisición */}
        <label className="text-slate-500 nb-2 block text-sm">
          Fecha de adquisición
        </label>
        <input
          type="date"
          {...register("fechaAdquisicion", {
            required: {
              value: true,
              message: "Fecha de adquisición es obligatoria",
            },
            validate: (value) =>
              value <= today ||
              "La fecha de adquisición no puede ser mayor a hoy",
          })}
          className="w-full p-2 rounded bg-slate-700"
        />
        {errors.fechaAdquisicion && (
          <span className="text-red-500 text-sm">
            {errors.fechaAdquisicion.message}
          </span>
        )}

        {/* Ubicación */}
        <label className="text-slate-500 nb-2 block text-sm">Ubicación</label>
        <select
          {...register("idUbicacionActual", {
            required: { value: true, message: "Ubicación es obligatoria" },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
        >
          <option value="">Seleccione la Ubicación</option>
          {ubicaciones.map((ubicacion) => (
            <option key={ubicacion.id} value={ubicacion.id}>
              {ubicacion.nombre}
            </option>
          ))}
        </select>
        {errors.idUbicacionActual && (
          <span className="text-red-500 text-sm">
            {String(errors.idUbicacionActual.message)}
          </span>
        )}

        {/* Tipo de Garantía */}
        <div>
          <label className="block mb-1">Tipo de Garantía</label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                value="lifetime"
                {...register("garantia.tipo", { required: true })}
                className="mr-2"
              />
              Garantía de por vida
            </label>
            <label>
              <input
                type="radio"
                value="duration"
                {...register("garantia.tipo", { required: true })}
                className="mr-2"
              />
              Ingresar duración de garantía
            </label>
          </div>
          {errors.garantia?.tipo && (
            <span className="text-red-500 text-sm">Seleccione una opción</span>
          )}
        </div>

        {/* Campos de duración (solo si se selecciona "Ingresar duración de garantía") */}
        {tipoGarantia === "duration" && (
          <>
            <div>
              <label className="block mb-1">Garantía - Años</label>
              <input
                type="number"
                {...register("garantia.anios", {
                  required: {
                    value: true,
                    message: "Garantía - Años es obligatorio",
                  },
                  min: {
                    value: 0,
                    message: "El valor debe ser mayor o igual a 0",
                  },
                  max: {
                    value: 20,
                    message: "El valor debe ser menor o igual a 20",
                  },
                })}
                className="w-full p-2 rounded bg-slate-700"
              />
              {errors.garantia?.anios && (
                <span className="text-red-500 text-sm">
                  {errors.garantia.anios.message}
                </span>
              )}
            </div>
            <div>
              <label className="block mb-1">Garantía - Meses</label>
              <input
                type="number"
                {...register("garantia.meses", {
                  required: {
                    value: true,
                    message: "Garantía - Meses es obligatorio",
                  },
                  min: {
                    value: 0,
                    message: "El valor debe ser mayor o igual a 0",
                  },
                  max: {
                    value: 12,
                    message: "El valor debe ser menor o igual a 12",
                  },
                })}
                className="w-full p-2 rounded bg-slate-700"
              />
              {errors.garantia?.meses && (
                <span className="text-red-500 text-sm">
                  {errors.garantia.meses.message}
                </span>
              )}
            </div>
            <div>
              <label className="block mb-1">Garantía - Días</label>
              <input
                type="number"
                {...register("garantia.dias", {
                  required: {
                    value: true,
                    message: "Garantía - Días es obligatorio",
                  },
                  min: {
                    value: 0,
                    message: "El valor debe ser mayor o igual a 0",
                  },
                  max: {
                    value: 31,
                    message: "El valor debe ser menor o igual a 31",
                  },
                })}
                className="w-full p-2 rounded bg-slate-700"
              />
              {errors.garantia?.dias && (
                <span className="text-red-500 text-sm">
                  {errors.garantia.dias.message}
                </span>
              )}
            </div>
          </>
        )}

        {/* Botón de envío */}
        <div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 rounded hover:bg-blue-600"
          >
            Modificar equipo
          </button>
        </div>
      </form>
    </div>
  );
}
