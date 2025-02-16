import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EquipoCardProps } from "@/app/types";
import Image from "next/image";

const EquipoCard = ({ equipo }: EquipoCardProps) => {
  const [imagen, setImagen] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchImagen() {
      try {
        // Realiza la request a tu API de imágenes, pasando el id del equipo
        const res = await fetch(`/api/imagenes/${equipo.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();

          if (data && data.length > 0) {
            let base64Str = data[0].data;
            if (!base64Str.startsWith("data:image")) {
              base64Str = `data:image/jpeg;base64,${base64Str}`;
            }
            setImagen(base64Str);
          }
        } else {
          console.error("Error al obtener la imagen:", res.statusText);
        }
      } catch (error) {
        console.error("Error al hacer fetch de la imagen:", error);
      }
    }
    fetchImagen();
  }, [equipo.id]);

  return (
    <div className="bg-slate-700 rounded-lg shadow-lg overflow-hidden">
      {imagen ? (
        <div className="h-48 w-full">
          <Image
            src={imagen}
            alt={equipo.nombre}
            width={500} // Ancho en píxeles
            height={300} // Alto en píxeles
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <div className="h-48 w-full bg-gray-500 flex items-center justify-center">
          <span className="text-sm">Sin imagen</span>
        </div>
      )}
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-2">{equipo.nombre}</h2>
        {/* Aquí puedes mostrar otros atributos del equipo */}
        <p>
          <strong>Tipo:</strong> {equipo.nombreTipoEquipo}
        </p>
        <p>
          <strong>Marca:</strong> {equipo.nombreMarca}
        </p>
        <p>
          <strong>Modelo:</strong> {equipo.nombreModelo}
        </p>
        <p>
          <strong>Serie:</strong> {equipo.numSerie}
        </p>
        <p>
          <strong>País:</strong> {equipo.nombrePais}
        </p>
        <p>
          <strong>Proveedor:</strong> {equipo.nombreProveedor}
        </p>
        <p>
          <strong>Fecha Adq.:</strong> {equipo.fechaAdquisicion}
        </p>
        <p>
          <strong>Ubicación:</strong> {equipo.nombreUbicacion}
        </p>
        {/* Botones para modificar y eliminar */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => router.push(`/equipos/edit/${equipo.id}`)}
            className="mr-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            Modificar
          </button>
          <button
            onClick={() => router.push(`/equipos/delete/${equipo.id}`)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipoCard;
