module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/mongoose [external] (mongoose, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Conexion a MongoDB con patron de cache (singleton).
 *
 * En entornos serverless (como Vercel / Next.js), cada invocacion de funcion
 * puede reutilizar el mismo proceso de Node.js ("warm start"). Sin este cache
 * se crearian multiples conexiones a Mongo en cada peticion, agotando el pool
 * de conexiones. Guardar la conexion en `global` asegura que persista entre
 * invocaciones dentro del mismo proceso.
 */ __turbopack_context__.s([
    "dbConnect",
    ()=>dbConnect
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
// Si ya existe una cache en global, la reutilizamos; si no, creamos una nueva
const cached = global.mongooseCache || {
    conn: null,
    promise: null
};
if (!global.mongooseCache) {
    global.mongooseCache = cached;
}
async function dbConnect() {
    // Retorno inmediato si ya hay una conexion activa
    if (cached.conn) return cached.conn;
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
        throw new Error('MONGO_URI is not defined in environment variables');
    }
    // Solo creamos la promesa si no existe — asi multiples llamadas simultaneas
    // esperan la misma conexion en vez de abrir varias
    if (!cached.promise) {
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connect(MONGO_URI, {
            bufferCommands: false
        });
    }
    try {
        cached.conn = await cached.promise;
    } catch (err) {
        // IMPORTANTE: reseteamos la promesa para no quedar atrapados con una
        // promesa rechazada permanentemente. Asi el siguiente intento reintenta la conexion.
        cached.promise = null;
        throw err;
    }
    return cached.conn;
}
}),
"[project]/models/Booking.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const BookingSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    user: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'User',
        required: true
    },
    service: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'Service',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [
            'pendiente',
            'confirmada',
            'cancelada',
            'completada'
        ],
        default: 'confirmada'
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1,
        max: 10
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});
BookingSchema.index({
    date: 1,
    startTime: 1
});
BookingSchema.index({
    user: 1,
    status: 1
});
const Booking = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Booking || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Booking', BookingSchema);
const __TURBOPACK__default__export__ = Booking;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/auth.config.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/models/User.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$3$2e$0$2e$3$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/bcryptjs@3.0.3/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
;
const UserSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phone: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: [
            'user',
            'admin'
        ],
        default: 'user'
    },
    googleId: {
        type: String,
        sparse: true
    },
    image: {
        type: String
    }
}, {
    timestamps: true
});
UserSchema.pre('save', async function() {
    if (!this.isModified('password') || !this.password) return;
    const salt = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$3$2e$0$2e$3$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].genSalt(12);
    this.password = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$3$2e$0$2e$3$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(this.password, salt);
});
UserSchema.methods.comparePassword = async function(candidate) {
    if (!this.password) return false;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$3$2e$0$2e$3$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(candidate, this.password);
};
UserSchema.set('toJSON', {
    transform: (_doc, ret)=>{
        delete ret.password;
        return ret;
    }
});
const User = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.User || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('User', UserSchema);
const __TURBOPACK__default__export__ = User;
}),
"[project]/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "auth",
    ()=>auth,
    "handlers",
    ()=>handlers,
    "signIn",
    ()=>signIn,
    "signOut",
    ()=>signOut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$5$2e$0$2e$0$2d$beta$2e$30_nex_61fbe084df825d8fdbaad79478274efd$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-auth@5.0.0-beta.30_nex_61fbe084df825d8fdbaad79478274efd/node_modules/next-auth/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$5$2e$0$2e$0$2d$beta$2e$30_nex_61fbe084df825d8fdbaad79478274efd$2f$node_modules$2f$next$2d$auth$2f$providers$2f$google$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-auth@5.0.0-beta.30_nex_61fbe084df825d8fdbaad79478274efd/node_modules/next-auth/providers/google.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$auth$2b$core$40$0$2e$41$2e$0_nodemailer$40$8$2e$0$2e$2$2f$node_modules$2f40$auth$2f$core$2f$providers$2f$google$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@auth+core@0.41.0_nodemailer@8.0.2/node_modules/@auth/core/providers/google.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$5$2e$0$2e$0$2d$beta$2e$30_nex_61fbe084df825d8fdbaad79478274efd$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-auth@5.0.0-beta.30_nex_61fbe084df825d8fdbaad79478274efd/node_modules/next-auth/providers/credentials.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$auth$2b$core$40$0$2e$41$2e$0_nodemailer$40$8$2e$0$2e$2$2f$node_modules$2f40$auth$2f$core$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@auth+core@0.41.0_nodemailer@8.0.2/node_modules/@auth/core/providers/credentials.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.config.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/User.ts [app-route] (ecmascript)");
;
;
;
;
;
;
const { handlers, auth, signIn, signOut } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$5$2e$0$2e$0$2d$beta$2e$30_nex_61fbe084df825d8fdbaad79478274efd$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])({
    ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authConfig"],
    providers: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$auth$2b$core$40$0$2e$41$2e$0_nodemailer$40$8$2e$0$2e$2$2f$node_modules$2f40$auth$2f$core$2f$providers$2f$google$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$auth$2b$core$40$0$2e$41$2e$0_nodemailer$40$8$2e$0$2e$2$2f$node_modules$2f40$auth$2f$core$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email'
                },
                password: {
                    label: 'Password',
                    type: 'password'
                }
            },
            async authorize (credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbConnect"])();
                const user = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
                    email: credentials.email
                });
                if (!user || !user.password) return null;
                const valid = await user.comparePassword(credentials.password);
                if (!valid) return null;
                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    image: user.image
                };
            }
        })
    ],
    callbacks: {
        async jwt ({ token, user, account }) {
            // On initial sign-in, populate token with user data
            if (user) {
                token.role = user.role || 'user';
                token.id = user.id;
            }
            // On Google sign-in, upsert the user in MongoDB
            if (account?.provider === 'google') {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbConnect"])();
                const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
                    email: token.email
                });
                if (!existing) {
                    const newUser = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
                        name: token.name,
                        email: token.email,
                        googleId: account.providerAccountId,
                        role: 'user',
                        image: token.picture
                    });
                    token.id = newUser._id.toString();
                    token.role = 'user';
                } else {
                    token.id = existing._id.toString();
                    token.role = existing.role;
                    // Update Google ID if missing
                    if (!existing.googleId) {
                        existing.googleId = account.providerAccountId;
                        existing.image = token.picture || existing.image;
                        await existing.save();
                    }
                }
            }
            // Re-read role from DB on every token refresh to prevent stale admin roles
            if (!user && !account && token.id) {
                try {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbConnect"])();
                    const dbUser = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(token.id).select('role').lean();
                    if (dbUser) {
                        token.role = dbUser.role || 'user';
                    }
                } catch  {
                // If DB read fails, keep existing token role
                }
            }
            return token;
        },
        async session ({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role || 'user';
            }
            return session;
        }
    }
});
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/dns [external] (dns, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("dns", () => require("dns"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[project]/lib/email.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sendEmail",
    ()=>sendEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nodemailer$40$8$2e$0$2e$2$2f$node_modules$2f$nodemailer$2f$lib$2f$nodemailer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/nodemailer@8.0.2/node_modules/nodemailer/lib/nodemailer.js [app-route] (ecmascript)");
;
const transporter = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nodemailer$40$8$2e$0$2e$2$2f$node_modules$2f$nodemailer$2f$lib$2f$nodemailer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD
    }
});
async function sendEmail(to, subject, html) {
    try {
        await transporter.sendMail({
            from: `"Lii.lab" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}
}),
"[project]/lib/whatsapp.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Send WhatsApp message via CallMeBot API (free tier).
 * Requires the admin to activate their phone at https://www.callmebot.com/blog/free-api-whatsapp-messages/
 *
 * If Twilio credentials are provided, uses Twilio WhatsApp instead.
 */ __turbopack_context__.s([
    "sendWhatsApp",
    ()=>sendWhatsApp,
    "sendWhatsAppToAdmin",
    ()=>sendWhatsAppToAdmin
]);
async function sendWhatsApp(to, message) {
    try {
        // Try Twilio first if configured
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM) {
            const accountSid = process.env.TWILIO_ACCOUNT_SID;
            const authToken = process.env.TWILIO_AUTH_TOKEN;
            const from = process.env.TWILIO_WHATSAPP_FROM;
            const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
            const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
            const body = new URLSearchParams({
                From: `whatsapp:${from}`,
                To: `whatsapp:${to}`,
                Body: message
            });
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: body.toString()
            });
            if (!res.ok) {
                const errData = await res.text();
                console.error('Twilio WhatsApp error:', errData);
                throw new Error('Twilio WhatsApp failed');
            }
            return;
        }
        // Fallback to CallMeBot
        if (process.env.CALLMEBOT_API_KEY) {
            const phone = to.replace('+', '');
            const apiKey = process.env.CALLMEBOT_API_KEY;
            const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;
            const res = await fetch(url);
            if (!res.ok) {
                console.error('CallMeBot error:', await res.text());
                throw new Error('CallMeBot WhatsApp failed');
            }
            return;
        }
        console.warn('WhatsApp not configured: no Twilio or CallMeBot credentials');
    } catch (error) {
        console.error('Error sending WhatsApp:', error);
        throw error;
    }
}
async function sendWhatsAppToAdmin(message) {
    const adminPhone = process.env.ADMIN_WHATSAPP;
    if (!adminPhone) {
        console.warn('ADMIN_WHATSAPP not configured');
        return;
    }
    await sendWhatsApp(adminPhone, message);
}
}),
"[project]/lib/email-templates/booking-confirmation.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "bookingConfirmationTemplate",
    ()=>bookingConfirmationTemplate
]);
function bookingConfirmationTemplate(data) {
    const dateFormatted = new Date(data.date + 'T00:00:00').toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa; padding: 40px 20px;">
  <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e5e5e5;">
    <div style="background-color: #CDB4DB; padding: 24px; text-align: center;">
      <h1 style="color: white; font-size: 24px; margin: 0; font-family: Georgia, serif;">Lii.lab</h1>
    </div>
    <div style="padding: 32px;">
      <h2 style="font-size: 20px; color: #171717; margin-top: 0;">¡Reserva confirmada!</h2>
      <p style="color: #525252; font-size: 14px; line-height: 1.6;">
        Hola ${data.clientName}, tu cita ha sido confirmada con los siguientes datos:
      </p>
      <div style="background: #fafafa; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <p style="margin: 8px 0; font-size: 14px;"><strong>Servicio:</strong> ${data.serviceName}</p>
        <p style="margin: 8px 0; font-size: 14px; text-transform: capitalize;"><strong>Fecha:</strong> ${dateFormatted}</p>
        <p style="margin: 8px 0; font-size: 14px;"><strong>Hora:</strong> ${data.startTime} - ${data.endTime}</p>
        <p style="margin: 8px 0; font-size: 14px;"><strong>Precio:</strong> ${data.price}€ (pago en el salón)</p>
      </div>
      <p style="color: #525252; font-size: 14px; line-height: 1.6;">
        <strong>Dirección:</strong> Calle Narváez, 1, 28342, Valdemoro
      </p>
      <p style="color: #a3a3a3; font-size: 12px; margin-top: 24px;">
        Si necesitas cancelar o cambiar tu cita, puedes hacerlo desde tu panel de usuario o contactándonos por Instagram.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
}),
"[project]/lib/email-templates/booking-cancellation.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "bookingCancellationTemplate",
    ()=>bookingCancellationTemplate
]);
function bookingCancellationTemplate(data) {
    const dateFormatted = new Date(data.date + 'T00:00:00').toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa; padding: 40px 20px;">
  <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e5e5e5;">
    <div style="background-color: #CDB4DB; padding: 24px; text-align: center;">
      <h1 style="color: white; font-size: 24px; margin: 0; font-family: Georgia, serif;">Lii.lab</h1>
    </div>
    <div style="padding: 32px;">
      <h2 style="font-size: 20px; color: #171717; margin-top: 0;">Cita cancelada</h2>
      <p style="color: #525252; font-size: 14px; line-height: 1.6;">
        Hola ${data.clientName}, tu cita ha sido cancelada:
      </p>
      <div style="background: #fef2f2; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <p style="margin: 8px 0; font-size: 14px;"><strong>Servicio:</strong> ${data.serviceName}</p>
        <p style="margin: 8px 0; font-size: 14px; text-transform: capitalize;"><strong>Fecha:</strong> ${dateFormatted}</p>
        <p style="margin: 8px 0; font-size: 14px;"><strong>Hora:</strong> ${data.startTime}</p>
      </div>
      <p style="color: #525252; font-size: 14px;">
        Si quieres reservar una nueva cita, puedes hacerlo desde nuestra web.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
}),
"[project]/lib/email-templates/booking-reminder.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "bookingReminderTemplate",
    ()=>bookingReminderTemplate
]);
function bookingReminderTemplate(data) {
    const dateFormatted = new Date(data.date + 'T00:00:00').toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa; padding: 40px 20px;">
  <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e5e5e5;">
    <div style="background-color: #CDB4DB; padding: 24px; text-align: center;">
      <h1 style="color: white; font-size: 24px; margin: 0; font-family: Georgia, serif;">Lii.lab</h1>
    </div>
    <div style="padding: 32px;">
      <h2 style="font-size: 20px; color: #171717; margin-top: 0;">Recordatorio de tu cita</h2>
      <p style="color: #525252; font-size: 14px; line-height: 1.6;">
        Hola ${data.clientName}, te recordamos que mañana tienes una cita en Lii.lab:
      </p>
      <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <p style="margin: 8px 0; font-size: 14px;"><strong>Servicio:</strong> ${data.serviceName}</p>
        <p style="margin: 8px 0; font-size: 14px; text-transform: capitalize;"><strong>Fecha:</strong> ${dateFormatted}</p>
        <p style="margin: 8px 0; font-size: 14px;"><strong>Hora:</strong> ${data.startTime} - ${data.endTime}</p>
      </div>
      <p style="color: #525252; font-size: 14px;">
        <strong>Dirección:</strong> Calle Narváez, 1, 28342, Valdemoro
      </p>
      <p style="color: #a3a3a3; font-size: 12px; margin-top: 24px;">
        Si necesitas cancelar, hazlo desde tu panel de usuario con al menos 24 horas de antelación.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
}),
"[project]/lib/email-templates/guide-purchase.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "guidePurchaseTemplate",
    ()=>guidePurchaseTemplate
]);
function guidePurchaseTemplate(data) {
    const baseUrl = ("TURBOPACK compile-time value", "http://localhost:3001") || 'https://liilab.vercel.app';
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa; padding: 40px 20px;">
  <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e5e5e5;">
    <div style="background-color: #CDB4DB; padding: 24px; text-align: center;">
      <h1 style="color: white; font-size: 24px; margin: 0; font-family: Georgia, serif;">Lii.lab</h1>
    </div>
    <div style="padding: 32px;">
      <h2 style="font-size: 20px; color: #171717; margin-top: 0;">¡Gracias por tu compra!</h2>
      <p style="color: #525252; font-size: 14px; line-height: 1.6;">
        Hola ${data.clientName}, gracias por adquirir la Guía Metodológica de Lii.lab.
      </p>
      <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
        <p style="margin: 0 0 16px; font-size: 14px; font-weight: 600;">Guía Metodológica Lii.lab</p>
        <a href="${baseUrl}${data.downloadUrl}" style="display: inline-block; background: #CDB4DB; color: white; text-decoration: none; padding: 12px 32px; border-radius: 9999px; font-size: 14px; font-weight: 500;">
          Descargar Guía
        </a>
      </div>
      <p style="color: #a3a3a3; font-size: 12px; margin-top: 24px;">
        Si tienes algún problema con la descarga, contacta con nosotros en lii.lab.space@gmail.com
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
}),
"[project]/lib/notifications.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "notifyCancellation",
    ()=>notifyCancellation,
    "notifyGuidePurchase",
    ()=>notifyGuidePurchase,
    "notifyNewBooking",
    ()=>notifyNewBooking,
    "sendBookingReminder",
    ()=>sendBookingReminder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/email.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$whatsapp$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/whatsapp.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2d$templates$2f$booking$2d$confirmation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/email-templates/booking-confirmation.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2d$templates$2f$booking$2d$cancellation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/email-templates/booking-cancellation.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2d$templates$2f$booking$2d$reminder$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/email-templates/booking-reminder.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2d$templates$2f$guide$2d$purchase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/email-templates/guide-purchase.ts [app-route] (ecmascript)");
;
;
;
;
;
;
async function notifyNewBooking(info) {
    // Generamos el HTML del email (lo usamos para el admin y como plan B del cliente)
    const html = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2d$templates$2f$booking$2d$confirmation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["bookingConfirmationTemplate"])({
        clientName: info.clientName,
        serviceName: info.serviceName,
        date: info.date,
        startTime: info.startTime,
        endTime: info.endTime,
        price: info.price
    });
    // Correo del administrador (configurable en .env)
    const adminEmail = process.env.ADMIN_EMAIL || 'lii.lab.space@gmail.com';
    // Formateamos fecha al estilo español DD/MM
    const dateFormatted = new Date(info.date + 'T00:00:00').toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit'
    });
    // Mensaje WhatsApp para el administrador
    const adminWhatsappMsg = `Nueva reserva en Lii.lab:\n` + `${info.clientName}\n` + `${info.serviceName}\n` + `${dateFormatted} a las ${info.startTime}\n` + `${info.price}\u20AC`;
    // Mensaje WhatsApp para el cliente (bonito y claro)
    const clientWhatsappMsg = `Hola ${info.clientName}! Tu reserva en Lii.lab esta confirmada:\n\n` + `Servicio: ${info.serviceName}\n` + `Fecha: ${dateFormatted}\n` + `Hora: ${info.startTime}\n\n` + `Te esperamos!`;
    // Siempre avisamos al administrador por email y WhatsApp
    const promises = [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendEmail"])(adminEmail, `Nueva reserva: ${info.clientName} - ${info.serviceName}`, html),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$whatsapp$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendWhatsAppToAdmin"])(adminWhatsappMsg)
    ];
    // Al cliente: WhatsApp si tiene teléfono, email si no
    if (info.clientPhone) {
        promises.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$whatsapp$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendWhatsApp"])(info.clientPhone, clientWhatsappMsg));
    } else {
        promises.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendEmail"])(info.clientEmail, 'Reserva confirmada - Lii.lab', html));
    }
    const results = await Promise.allSettled(promises);
    // Registramos en consola cualquier fallo sin interrumpir la ejecución
    results.forEach((r, i)=>{
        if (r.status === 'rejected') {
            console.error(`Error al enviar notificacion (canal ${i}):`, r.reason);
        }
    });
}
async function notifyCancellation(info) {
    const html = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2d$templates$2f$booking$2d$cancellation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["bookingCancellationTemplate"])({
        clientName: info.clientName,
        serviceName: info.serviceName,
        date: info.date,
        startTime: info.startTime
    });
    const adminEmail = process.env.ADMIN_EMAIL || 'lii.lab.space@gmail.com';
    // Mensaje para el administrador
    const adminWhatsappMsg = `Cita cancelada:\n` + `${info.clientName}\n` + `${info.serviceName}\n` + `${info.date} ${info.startTime}`;
    // Mensaje para el cliente
    const clientWhatsappMsg = `Hola ${info.clientName}. Tu cita para ${info.serviceName} ` + `el ${info.date} a las ${info.startTime} ha sido cancelada.\n` + `Esperamos verte pronto en Lii.lab.`;
    const promises = [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendEmail"])(adminEmail, `Cita cancelada: ${info.clientName}`, html),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$whatsapp$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendWhatsAppToAdmin"])(adminWhatsappMsg)
    ];
    if (info.clientPhone) {
        promises.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$whatsapp$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendWhatsApp"])(info.clientPhone, clientWhatsappMsg));
    } else {
        promises.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendEmail"])(info.clientEmail, 'Cita cancelada - Lii.lab', html));
    }
    await Promise.allSettled(promises);
}
async function sendBookingReminder(info) {
    const html = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2d$templates$2f$booking$2d$reminder$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["bookingReminderTemplate"])({
        clientName: info.clientName,
        serviceName: info.serviceName,
        date: info.date,
        startTime: info.startTime,
        endTime: info.endTime
    });
    const dateFormatted = new Date(info.date + 'T00:00:00').toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit'
    });
    // Mensaje de recordatorio por WhatsApp
    const whatsappMsg = `Recordatorio Lii.lab:\n` + `Hola ${info.clientName}, manana tienes cita:\n` + `${info.serviceName}\n` + `${dateFormatted} a las ${info.startTime}\n` + `Direccion: Calle Narvez, 1, Valdemoro`;
    // Declaramos el array de promesas antes de usarlo
    const promises = [];
    if (info.clientPhone) {
        promises.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$whatsapp$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendWhatsApp"])(info.clientPhone, whatsappMsg));
    } else {
        promises.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendEmail"])(info.clientEmail, 'Recordatorio: tu cita es manana - Lii.lab', html));
    }
    await Promise.allSettled(promises);
}
async function notifyGuidePurchase(clientName, clientEmail, downloadUrl) {
    const html = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2d$templates$2f$guide$2d$purchase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["guidePurchaseTemplate"])({
        clientName,
        downloadUrl
    });
    await Promise.allSettled([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendEmail"])(clientEmail, 'Tu Guia Metodologica - Lii.lab', html)
    ]);
}
}),
"[project]/app/api/bookings/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Booking$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Booking.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/notifications.ts [app-route] (ecmascript)");
;
;
;
;
;
async function GET(_req, { params }) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
        if (!session) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'No autorizado'
            }, {
                status: 401
            });
        }
        const { id } = await params;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbConnect"])();
        const booking = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Booking$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(id).populate('service', 'name category price duration').populate('user', 'name email phone');
        if (!booking) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Reserva no encontrada'
            }, {
                status: 404
            });
        }
        // Users can only see their own bookings, admins can see all
        if (session.user.role !== 'admin' && booking.user._id.toString() !== session.user.id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'No autorizado'
            }, {
                status: 403
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Error al obtener reserva'
        }, {
            status: 500
        });
    }
}
async function PATCH(req, { params }) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
        if (!session) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'No autorizado'
            }, {
                status: 401
            });
        }
        const { id } = await params;
        const body = await req.json();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbConnect"])();
        const booking = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Booking$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(id);
        if (!booking) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Reserva no encontrada'
            }, {
                status: 404
            });
        }
        // Users can only cancel their own bookings
        if (session.user.role !== 'admin' && booking.user.toString() !== session.user.id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'No autorizado'
            }, {
                status: 403
            });
        }
        // Admin can change any valid status, user can only cancel
        const validStatuses = [
            'pendiente',
            'confirmada',
            'cancelada',
            'completada'
        ];
        if (session.user.role === 'admin' && body.status) {
            if (!validStatuses.includes(body.status)) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Estado no válido'
                }, {
                    status: 400
                });
            }
            booking.status = body.status;
        } else if (body.status === 'cancelada') {
            booking.status = 'cancelada';
        } else {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Acción no permitida'
            }, {
                status: 400
            });
        }
        await booking.save();
        const populated = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Booking$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(booking._id).populate('service', 'name category price duration').populate('user', 'name email phone');
        // Send cancellation notification if status changed to cancelled
        if (booking.status === 'cancelada' && populated?.user && populated?.service) {
            const user = populated.user;
            const svc = populated.service;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["notifyCancellation"])({
                clientName: user.name,
                clientEmail: user.email,
                clientPhone: user.phone,
                serviceName: svc.name,
                date: booking.date,
                startTime: booking.startTime,
                endTime: booking.endTime,
                price: svc.price
            }).catch((err)=>console.error('Cancellation notification error:', err));
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(populated);
    } catch (error) {
        console.error('Error updating booking:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Error al actualizar reserva'
        }, {
            status: 500
        });
    }
}
async function DELETE(_req, { params }) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
        if (!session || session.user.role !== 'admin') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'No autorizado'
            }, {
                status: 403
            });
        }
        const { id } = await params;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbConnect"])();
        const booking = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Booking$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndDelete(id);
        if (!booking) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Reserva no encontrada'
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Reserva eliminada'
        });
    } catch (error) {
        console.error('Error deleting booking:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Error al eliminar reserva'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__bec2be7b._.js.map