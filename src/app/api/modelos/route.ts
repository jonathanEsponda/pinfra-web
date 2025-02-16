import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { apiFetch } from "@/app/utils/apiFetch";

export async function GET(req: NextRequest) {
  // Extraer el token de la sesión usando NextAuth
  const token = await getToken({ req });
  if (!token || !token.accessToken) {
    return NextResponse.json(
      { error: "Token invalido o expirado" },
      { status: 401 }
    );
  }

  const res = await apiFetch(`${process.env.API_REST}/modelos`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
  });

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

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await apiFetch(`${process.env.API_REST}/perfiles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  // Esto es porque no me devuelve un body en la res
  //const result = await res.json();

  return NextResponse.json(res);
}
