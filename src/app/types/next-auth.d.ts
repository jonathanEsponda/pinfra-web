import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    // Agrega propiedades adicionales si es necesario
    user: {
      id: number;
      idPerfil: number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: number;
      name: string;
      email: string;
      nombre: string;
      apellido: string;
      idPerfil: number;
    };
  }

  interface User {
    id: number;
    nombreUsuario: string;
    email: string;
    idPerfil?: number;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user?: {
      id: number;
      name: string;
      email: string;
      nombre: string;
      apellido: string;
      idPerfil: number;
    };
  }
}
