import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { apiFetch } from "@/app/utils/apiFetch";

export async function GET(
  req: NextRequest,
  context: { params: { idUsuario: string } }
) {
  // Extraer el token de la sesión usando el helper de NextAuth
  const token = await getToken({ req });
  if (!token || !token.accessToken) {
    return NextResponse.json(
      { error: "No estás autenticado o no se encontró el token" },
      { status: 401 }
    );
  }

  // Obtener el id parametro de context
  const { idUsuario } = await context.params;
  // Hacer la llamada al backend incluyendo el token en el encabezado Authorization
  const res = await apiFetch(`${process.env.API_REST}/telefonos/${idUsuario}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
  });

  // Intentar parsear la respuesta como JSON
  try {
    const result = await res.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: "La respuesta del backend no es un JSON válido",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
