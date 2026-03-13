(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__da896387._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/lib/auth.config.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * CONFIGURACION EDGE-COMPATIBLE DE AUTH.JS (next-auth v5)
 *
 * Este archivo contiene la configuracion MINIMA de autenticacion que puede
 * ejecutarse en el Edge Runtime (middleware de Next.js).
 *
 * IMPORTANTE: No importar Mongoose, bcrypt ni ningun modulo de Node.js aqui,
 * ya que el Edge Runtime no los soporta. Los providers reales y la logica
 * de base de datos se configuran en auth.ts (que corre en Node.js).
 *
 * Los callbacks jwt/session DEBEN estar aqui para que el middleware pueda
 * decodificar el JWT y leer el `role` del usuario (necesario para proteger
 * las rutas /admin).
 */ __turbopack_context__.s([
    "authConfig",
    ()=>authConfig
]);
const authConfig = {
    // Redirigir a /login cuando se necesita autenticacion
    pages: {
        signIn: '/login'
    },
    // Usamos JWT (no sesiones en BD) para que funcione en edge y serverless
    session: {
        strategy: 'jwt'
    },
    // Providers vacios aqui — se definen en auth.ts (que tiene acceso a Mongoose/bcrypt)
    providers: [],
    callbacks: {
        /**
     * Callback JWT: se ejecuta cada vez que se crea o actualiza el token.
     * Cuando el usuario inicia sesion por primera vez (`user` existe),
     * guardamos su rol e ID en el token para tenerlos disponibles despues.
     */ async jwt ({ token, user }) {
            if (user) {
                token.role = user.role || 'user';
                token.id = user.id;
            }
            return token;
        },
        /**
     * Callback Session: traduce los datos del token JWT a la sesion del cliente.
     * Asi, en cualquier componente podemos hacer `session.user.role` y `session.user.id`.
     */ async session ({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role || 'user';
            }
            return session;
        }
    }
};
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$5$2e$0$2e$0$2d$beta$2e$30_nex_61fbe084df825d8fdbaad79478274efd$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-auth@5.0.0-beta.30_nex_61fbe084df825d8fdbaad79478274efd/node_modules/next-auth/index.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$config$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.config.ts [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
;
;
// Use ONLY the edge-compatible config (no Mongoose / bcrypt imports)
const { auth } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$5$2e$0$2e$0$2d$beta$2e$30_nex_61fbe084df825d8fdbaad79478274efd$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$config$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["authConfig"]);
const __TURBOPACK__default__export__ = auth((req)=>{
    const { pathname } = req.nextUrl;
    const session = req.auth;
    // Protect /dashboard — require authentication (/booking is open, auth checked at confirm step)
    if (pathname.startsWith('/dashboard') && !session) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
    }
    // Protect /admin — require admin role
    if (pathname.startsWith('/admin')) {
        if (!session) {
            const loginUrl = new URL('/login', req.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
        }
        if (session.user?.role !== 'admin') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/', req.url));
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
});
const config = {
    matcher: [
        '/dashboard/:path*',
        '/admin/:path*'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__da896387._.js.map