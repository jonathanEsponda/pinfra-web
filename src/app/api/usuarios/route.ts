import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { apiFetch } from "@/app/utils/apiFetch";

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

  await apiFetch(`${process.env.API_REST}/usuarios`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
    body: JSON.stringify(body),
  });

  // Intentar parsear la respuesta como JSON
  try {
    return NextResponse.json("Modificando...");
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
