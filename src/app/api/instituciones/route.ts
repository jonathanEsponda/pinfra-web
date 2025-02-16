import { apiFetch } from "@/app/utils/apiFetch";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const res = await apiFetch(`${process.env.API_REST}/instituciones`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await res.json();

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await apiFetch(`${process.env.API_REST}/instituciones`, {
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
