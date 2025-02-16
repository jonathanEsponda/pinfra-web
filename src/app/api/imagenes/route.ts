import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || !token.accessToken) {
    return NextResponse.json(
      { error: "No estás autenticado o no se encontró el token" },
      { status: 401 }
    );
  }
  try {
    const body = await req.json();
    await fetch(`${process.env.API_REST}/imagenes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json("registrando...");
  } catch (error) {
    return NextResponse.json(
      {
        error: "La respuesta del backend no es un JSON válido",
        details: String(error),
      },
      {
        status: 500,
      }
    );
  }
}
