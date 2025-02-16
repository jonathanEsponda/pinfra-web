import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { apiFetch } from "@/app/utils/apiFetch";

// Activar usuario
export async function PUT(req: NextRequest) {
  // Extraer el token de la sesión usando el helper de NextAuth
  const token = await getToken({ req });
  if (!token || !token.accessToken) {
    return NextResponse.json(
      { error: "No estás autenticado o no se encontró el token" },
      { status: 401 }
    );
  }

  const body = await req.json();
  try {
    const res = await apiFetch(`${process.env.API_REST}/telefonos`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(res);
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

// Obtener usuario por idUsuario
export async function GET(req: NextRequest) {
  // Extraer el token de la sesión usando el helper de NextAuth
  const token = await getToken({ req });
  if (!token || !token.accessToken) {
    return NextResponse.json(
      { error: "No estás autenticado o no se encontró el token" },
      { status: 401 }
    );
  }

  const idUsuario = token.user?.id;

  // Hacer la llamada al backend incluyendo el token en el encabezado Authorization
  const res = await apiFetch(`${process.env.API_REST}/telefonos/${idUsuario}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
  });

  try {
    const result = await res.json();
    console.log("result:", result);
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
