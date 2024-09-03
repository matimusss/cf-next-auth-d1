import { Lucia } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";
import { getRequestContext } from "@cloudflare/next-on-pages"; // Asegúrate de que esta librería esté instalada y configurada

export const runtime = "edge"; // Indica que tu código se ejecuta en el entorno de Edge Workers

//D1Adapter takes a D1Database instance and a list of table names.
//Since the D1 binding is included with the request, create an initializeLucia()
// function to create a new Lucia instance on every request.

export function initializeLucia() {
    // Accede al binding D1 directamente desde el contexto del request
    const D1 = getRequestContext().env.DB; // DB debe ser el nombre del binding configurado en wrangler.toml
    const adapter = new D1Adapter(D1, {
        user: "users",    // Reemplaza "user" con el nombre real de tu tabla de usuarios
        session: "user_sessions" // Reemplaza "session" con el nombre real de tu tabla de sesiones
    });
    return new Lucia(adapter);
}

declare module "lucia" {
    interface Register {
        Lucia: ReturnType<typeof initializeLucia>;
    }
}
