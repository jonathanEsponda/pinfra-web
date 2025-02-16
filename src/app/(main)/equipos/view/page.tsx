"use client";
import { Controller, useForm } from "react-hook-form";
import { EquipoModelResponse, FiltroEquipoModel } from "@/app/types";
import { useEffect, useState } from "react";
import EquipoCard from "@/app/components/EquipoCard";

import {
  TipoEquipoModelResponse,
  MarcaModelResponse,
  ModeloModelResponse,
  PaisModelResponse,
  ProveedorModelResponse,
  UbicacionModelResponse,
  EquipoFiltroFormData,
} from "@/app/types";
import omitBy from "lodash/omitBy";

const EquiposView = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    control,
  } = useForm<EquipoFiltroFormData>();

  // //Obtengo la fecha HOY para no perimitir que la fecha adquisición sea mayor
  // const today = new Date().toISOString().split("T")[0];

  const [equipos, setEquipos] = useState<EquipoModelResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [tiposEquipos, setTiposEquipo] = useState<TipoEquipoModelResponse[]>(
    []
  );
  const [marcas, setMarcas] = useState<MarcaModelResponse[]>([]);
  const [modelos, setModelos] = useState<ModeloModelResponse[]>([]);
  const [paises, setPaises] = useState<PaisModelResponse[]>([]);
  const [prov, setProv] = useState<ProveedorModelResponse[]>([]);
  const [ubicaciones, setUbicaciones] = useState<UbicacionModelResponse[]>([]);

  // Obtener Tipos de Equipo desde la API
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

  // Obtener Paises desde la API
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

  // Obtener Proveedores desde la API
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

  // Obtener Ubicaciones desde la API
  useEffect(() => {
    async function fetchUbicaciones() {
      try {
        const res = await fetch("/api/ubicaciones");
        const data: UbicacionModelResponse[] = await res.json();
        setUbicaciones(data);
      } catch (error) {
        console.error("Error al obtener Ubicaciones:", error);
      }
    }
    fetchUbicaciones();
  }, []);

  // Obtener Marcas desde la API
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

  const selectedMarca = watch("idMarca");

  // Obtener Modelos desde la API
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
      // Si no hay marca seleccionada, se vacía el combo de modelos
      setModelos([]);
    }
  }, [selectedMarca]);

  const onSubmit = async (data: EquipoFiltroFormData) => {
    const filtrarEquipo: FiltroEquipoModel = {
      id: data.id ? Number(data.id) : undefined,
      nombre: data.nombre,
      // Mapeo de Id a nombres
      tipoEquipo: data.idTipoEquipo
        ? tiposEquipos.find((t) => t.id === Number(data.idTipoEquipo))?.nombre
        : undefined,
      marca: data.idMarca
        ? marcas.find((m) => m.id === Number(data.idMarca))?.nombre
        : undefined,
      modelo: data.idModelo
        ? modelos.find((m) => m.id === Number(data.idModelo))?.nombre
        : undefined,
      numSerie: data.numSerie,
      paisOrigen: data.idPaisOrigen
        ? paises.find((p) => p.id === Number(data.idPaisOrigen))?.nombre
        : undefined,
      proveedor: data.idProveedor
        ? prov.find((p) => p.id === Number(data.idProveedor))?.nombre
        : undefined,
      fechaAdquisicionDesde: data.fechaAdquisicionDesde,
      fechaAdquisicionHasta: data.fechaAdquisicionHasta,
      ubicacionActual: data.idUbicacionActual
        ? ubicaciones.find((u) => u.id === Number(data.idUbicacionActual))
            ?.nombre
        : undefined,
      activo:
        data.activo === "true"
          ? true
          : data.activo === "false"
          ? false
          : undefined,
    };

    // Filtra el objeto usando omitBy, para descartar valores nulos o ""
    const filteredData = omitBy(
      filtrarEquipo,
      (value) => value === null || value === undefined || value === ""
    );

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/equipos/getEquiposFiltrando", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filteredData),
      });

      const filteredEquipos: EquipoModelResponse[] = await res.json();

      // Enriquecer cada objeto consultando la API para obtener nombres
      const equiposEnriquecidos = await Promise.all(
        filteredEquipos.map(async (equipo) => {
          const nombretipoPromise = equipo.idTipoEquipo
            ? fetch(`/api/tiposEquipo/${equipo.idTipoEquipo}`)
                .then((res) => {
                  if (!res.ok) {
                    throw new Error("Error al obtener el tipo de equipo");
                  }
                  return res.json();
                })
                .catch((err) => {
                  console.error("Error en tipo de equipo:", err);
                  return { nombre: "Desconocido" };
                })
            : Promise.resolve({ nombre: "" });

          const nombreMarcaPromise = equipo.idMarca
            ? fetch(`/api/marcas/${equipo.idMarca}`)
                .then((res) => {
                  if (!res.ok) {
                    throw new Error("Error al obtener la marca");
                  }
                  return res.json();
                })
                .catch((err) => {
                  console.error("Error en marca:", err);
                  return { nombre: "Desconocido" };
                })
            : Promise.resolve({ nombre: "" });

          const nombreModeloPromise = equipo.idModelo
            ? fetch(`/api/modelos/${equipo.idModelo}`)
                .then((res) => {
                  if (!res.ok) {
                    throw new Error("Error al obtener el modelo");
                  }
                  return res.json();
                })
                .catch((err) => {
                  console.error("Error en modelo:", err);
                  return { nombre: "Desconocido" };
                })
            : Promise.resolve({ nombre: "" });

          const nombrePaisPromise = equipo.idPaisOrigen
            ? fetch(`/api/paises/${equipo.idPaisOrigen}`)
                .then((res) => {
                  if (!res.ok) {
                    throw new Error("Error al obtener el pais");
                  }
                  return res.json();
                })
                .catch((err) => {
                  console.error("Error en pais:", err);
                  return { nombre: "Desconocido" };
                })
            : Promise.resolve({ nombre: "" });

          const nombreProveedorPromise = equipo.idProveedor
            ? fetch(`/api/proveedores/${equipo.idProveedor}`)
                .then((res) => {
                  if (!res.ok) {
                    throw new Error("Error al obtener el Proveedor");
                  }
                  return res.json();
                })
                .catch((err) => {
                  console.error("Error en Proveedor:", err);
                  return { nombre: "Desconocido" };
                })
            : Promise.resolve({ nombre: "" });

          const nombreUbicacionPromise = equipo.idUbicacionActual
            ? fetch(`/api/ubicaciones/${equipo.idUbicacionActual}`)
                .then((res) => {
                  if (!res.ok) {
                    throw new Error("Error al obtener Ubicacion");
                  }
                  return res.json();
                })
                .catch((err) => {
                  console.error("Error en Ubicacion:", err);
                  return { nombre: "Desconocido" };
                })
            : Promise.resolve({ nombre: "" });

          const [
            tipoEquipoData,
            marcaData,
            modeloData,
            paisData,
            proveedorData,
            ubicacionData,
          ] = await Promise.all([
            nombretipoPromise,
            nombreMarcaPromise,
            nombreModeloPromise,
            nombrePaisPromise,
            nombreProveedorPromise,
            nombreUbicacionPromise,
          ]);

          return {
            ...equipo,
            nombreTipoEquipo: tipoEquipoData.nombre,
            nombreMarca: marcaData.nombre,
            nombreModelo: modeloData.nombre,
            nombrePais: paisData.nombre,
            nombreProveedor: proveedorData.nombre,
            nombreUbicacion: ubicacionData.nombre,
          };
        })
      );

      setEquipos(equiposEnriquecidos);
    } catch (error: unknown) {
      const errorMessage = "Ocurrió un error desconocido";
      console.error("Error al filtrar el equipo:", errorMessage);
      if (error instanceof Error) {
        console.error("Error al filtrar el equipo:", error.message);
      } else if (typeof error === "string") {
        console.error("Error al filtrar el equipo:", error);
      } else {
        console.error("Error al filtrar el equipo:", JSON.stringify(error));
      }
    } finally {
      setLoading(false);
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

          {/* Nombre */}
          <div className="flex flex-col">
            <label
              htmlFor="nombre"
              className="text-slate-500 nb-2 block text-sm"
            >
              Nombre
            </label>
            <input
              type="text"
              className="w-full p-2 rounded bg-slate-700"
              {...register("nombre", {
                maxLength: { value: 30, message: "Máximo 30 caracteres" },
              })}
            />
            {errors.nombre && (
              <span className="text-red-500 text-sm">
                {String(errors.nombre.message)}
              </span>
            )}
          </div>

          {/* Tipo de equipo */}
          <div className="flex flex-col">
            <label
              htmlFor="tipoEquipo"
              className="text-slate-500 nb-2 block text-sm"
            >
              Tipo de equipo
            </label>
            <select
              className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
              {...register("idTipoEquipo")}
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
          </div>

          {/* Marca */}
          <div className="flex flex-col">
            <label
              htmlFor="marca"
              className="text-slate-500 nb-2 block text-sm"
            >
              Marca
            </label>
            <select
              {...register("idMarca")}
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
          </div>

          {/* Modelo */}
          <div className="flex flex-col">
            <label
              htmlFor="modelo"
              className="text-slate-500 nb-2 block text-sm"
            >
              Modelo
            </label>
            <select
              {...register("idModelo")}
              disabled={!selectedMarca} //Se habilita seleccionando una marca
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
          </div>

          {/* Numero de serie */}
          <div className="flex flex-col">
            <label className="block mb-1">Número de Serie</label>
            <input
              type="text"
              {...register("numSerie", {
                maxLength: { value: 30, message: "Máximo 30 caracteres" },
              })}
              className="w-full p-2 rounded bg-slate-700"
            />

            {errors.numSerie && (
              <span className="text-red-500 text-sm">
                {String(errors.numSerie.message)}
              </span>
            )}
          </div>

          {/* Pais origen */}
          <div className="flex flex-col">
            <label htmlFor="pais" className="text-slate-500 nb-2 block text-sm">
              País de origen
            </label>
            <select
              {...register("idPaisOrigen")}
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
          </div>

          {/* Proveedor*/}
          <div className="flex flex-col">
            <label
              htmlFor="proveedor"
              className="text-slate-500 nb-2 block text-sm"
            >
              Proveedor
            </label>
            <select
              {...register("idProveedor")}
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
          </div>

          {/* Fecha Adquisición (desde)*/}
          <div className="flex flex-col">
            <label
              htmlFor="fechaAdquisicionDesde"
              className="text-slate-500 nb-2 block text-sm"
            >
              Fecha de adquisición (Desde)
            </label>
            <input
              type="date"
              {...register("fechaAdquisicionDesde")}
              className="w-full p-2 rounded bg-slate-700"
            />
            {errors.fechaAdquisicionDesde && (
              <span className="text-red-500 text-sm">
                {String(errors.fechaAdquisicionDesde.message)}
              </span>
            )}
          </div>

          {/* Fecha Adquisición (hasta)*/}
          <div className="flex flex-col">
            <label
              htmlFor="fechaAdquisicionHasta"
              className="text-slate-500 nb-2 block text-sm"
            >
              Fecha de adquisición (Hasta)
            </label>
            <input
              type="date"
              {...register("fechaAdquisicionHasta")}
              className="w-full p-2 rounded bg-slate-700"
            />
            {errors.fechaAdquisicionHasta && (
              <span className="text-red-500 text-sm">
                {String(errors.fechaAdquisicionHasta.message)}
              </span>
            )}
          </div>

          {/* Ubicación */}
          <div className="flex flex-col">
            <label
              htmlFor="ubicacion"
              className="text-slate-500 nb-2 block text-sm"
            >
              Ubicación
            </label>
            <select
              {...register("idUbicacionActual")}
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
          </div>

          {/* Estado */}
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
                  nombre: "",
                  idTipoEquipo: "",
                  idMarca: "",
                  idModelo: "",
                  numSerie: "",
                  idPaisOrigen: "",
                  idProveedor: "",
                  fechaAdquisicionDesde: "",
                  fechaAdquisicionHasta: "",
                  idUbicacionActual: "",
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
        Listado de Equipos
      </h1>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Mostrar Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipos.map((equipo) => (
          <EquipoCard key={equipo.id} equipo={equipo} />
        ))}
      </div>
    </div>
  );
};

export default EquiposView;
