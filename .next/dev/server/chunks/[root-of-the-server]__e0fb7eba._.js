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
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dbConnect",
    ()=>dbConnect
]);
/**
 * Conexion a MongoDB con patron de cache (singleton).
 *
 * En entornos serverless (como Vercel / Next.js), cada invocacion de funcion
 * puede reutilizar el mismo proceso de Node.js ("warm start"). Sin este cache
 * se crearian multiples conexiones a Mongo en cada peticion, agotando el pool
 * de conexiones. Guardar la conexion en `global` asegura que persista entre
 * invocaciones dentro del mismo proceso.
 */ var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$3$2e$0$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/.pnpm/mongoose@9.3.0/node_modules/mongoose)");
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
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$3$2e$0$2f$node_modules$2f$mongoose$29$__["default"].connect(MONGO_URI, {
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
"[project]/models/Service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$3$2e$0$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/.pnpm/mongoose@9.3.0/node_modules/mongoose)");
;
const ServiceSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$3$2e$0$2f$node_modules$2f$mongoose$29$__["Schema"]({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: [
            'Manicura',
            'Pedicura',
            'Reconstruccion',
            'Retirado',
            'Combo'
        ],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    popular: {
        type: Boolean,
        default: false
    },
    image: {
        type: String
    },
    includes: {
        type: String
    }
}, {
    timestamps: true
});
ServiceSchema.index({
    category: 1,
    active: 1
});
const Service = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$3$2e$0$2f$node_modules$2f$mongoose$29$__["default"].models.Service || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$3$2e$0$2f$node_modules$2f$mongoose$29$__["default"].model('Service', ServiceSchema);
const __TURBOPACK__default__export__ = Service;
}),
"[project]/models/Booking.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$3$2e$0$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/.pnpm/mongoose@9.3.0/node_modules/mongoose)");
;
const BookingSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$3$2e$0$2f$node_modules$2f$mongoose$29$__["Schema"]({
    user: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$3$2e$0$2f$node_modules$2f$mongoose$29$__["Schema"].Types.ObjectId,
        ref: 'User',
        required: true
    },
    services: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$3$2e$0$2f$node_modules$2f$mongoose$29$__["Schema"].Types.ObjectId,
            ref: 'Service',
            required: true
        }
    ],
    quantities: {
        type: Map,
        of: Number,
        default: {}
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
    notes: {
        type: String
    },
    paidAmount: {
        type: Number
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
const Booking = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$3$2e$0$2f$node_modules$2f$mongoose$29$__["default"].models.Booking || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$3$2e$0$2f$node_modules$2f$mongoose$29$__["default"].model('Booking', BookingSchema);
const __TURBOPACK__default__export__ = Booking;
}),
"[project]/models/BlockedDate.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$3$2e$0$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/.pnpm/mongoose@9.3.0/node_modules/mongoose)");
;
const BlockedDateSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$3$2e$0$2f$node_modules$2f$mongoose$29$__["Schema"]({
    date: {
        type: String,
        required: true,
        unique: true
    },
    reason: {
        type: String
    },
    blockedBy: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$3$2e$0$2f$node_modules$2f$mongoose$29$__["Schema"].Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});
const BlockedDate = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$3$2e$0$2f$node_modules$2f$mongoose$29$__["default"].models.BlockedDate || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$3$2e$0$2f$node_modules$2f$mongoose$29$__["default"].model('BlockedDate', BlockedDateSchema);
const __TURBOPACK__default__export__ = BlockedDate;
}),
"[project]/models/BlockedHour.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$3$2e$0$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/.pnpm/mongoose@9.3.0/node_modules/mongoose)");
;
const BlockedHourSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$3$2e$0$2f$node_modules$2f$mongoose$29$__["Schema"]({
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
    reason: {
        type: String
    },
    blockedBy: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$3$2e$0$2f$node_modules$2f$mongoose$29$__["Schema"].Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});
BlockedHourSchema.index({
    date: 1
});
const BlockedHour = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$3$2e$0$2f$node_modules$2f$mongoose$29$__["default"].models.BlockedHour || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$mongoose$40$9$2e$3$2e$0$2f$node_modules$2f$mongoose$29$__["default"].model('BlockedHour', BlockedHourSchema);
const __TURBOPACK__default__export__ = BlockedHour;
}),
"[project]/lib/schedule.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * HORARIO SEMANAL DEL ESTUDIO
 *
 * Define el horario de apertura para cada dia de la semana.
 * Cada dia tiene uno o mas "bloques" (franjas horarias de trabajo),
 * por ejemplo manana (10:00-14:00) y tarde (15:00-18:45).
 *
 * Este horario es la fuente de verdad para:
 * - La generacion de slots disponibles (lib/slots.ts)
 * - El calendario del admin (admin/schedule/page.tsx)
 * - El calendario de reservas del usuario (datetime-step.tsx)
 *
 * Para cambiar los horarios del estudio, solo hay que modificar este objeto.
 */ __turbopack_context__.s([
    "WEEK_SCHEDULE",
    ()=>WEEK_SCHEDULE,
    "getBlocksForDay",
    ()=>getBlocksForDay,
    "isDayOpen",
    ()=>isDayOpen,
    "minutesToTime",
    ()=>minutesToTime,
    "parseTimeToMinutes",
    ()=>parseTimeToMinutes
]);
const WEEK_SCHEDULE = {
    0: {
        open: false,
        blocks: []
    },
    1: {
        open: true,
        blocks: [
            {
                start: '10:00',
                end: '14:00'
            },
            {
                start: '15:00',
                end: '18:45'
            }
        ]
    },
    2: {
        open: true,
        blocks: [
            {
                start: '11:00',
                end: '14:00'
            },
            {
                start: '15:00',
                end: '21:00'
            }
        ]
    },
    3: {
        open: true,
        blocks: [
            {
                start: '09:00',
                end: '14:00'
            },
            {
                start: '15:00',
                end: '18:45'
            }
        ]
    },
    4: {
        open: true,
        blocks: [
            {
                start: '11:00',
                end: '14:00'
            },
            {
                start: '15:00',
                end: '21:00'
            }
        ]
    },
    5: {
        open: true,
        blocks: [
            {
                start: '09:00',
                end: '14:00'
            },
            {
                start: '15:00',
                end: '18:45'
            }
        ]
    },
    6: {
        open: false,
        blocks: []
    }
};
function isDayOpen(dayOfWeek) {
    return WEEK_SCHEDULE[dayOfWeek]?.open ?? false;
}
function getBlocksForDay(dayOfWeek) {
    return WEEK_SCHEDULE[dayOfWeek]?.blocks ?? [];
}
function parseTimeToMinutes(time) {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}
function minutesToTime(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}
}),
"[project]/lib/slots.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateAvailableSlots",
    ()=>generateAvailableSlots
]);
/**
 * Generador de horarios disponibles (slots).
 *
 * Algoritmo:
 * 1. Se obtienen los bloques horarios del dia (ej: manana y tarde).
 * 2. Dentro de cada bloque, un cursor avanza en intervalos de 15 minutos.
 * 3. Para cada posicion del cursor, se verifica si el servicio cabe dentro
 *    del bloque y si no colisiona con reservas existentes.
 * 4. Solo los horarios sin conflicto se devuelven como disponibles.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schedule$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/schedule.ts [app-route] (ecmascript)");
;
function generateAvailableSlots(params) {
    const { date, serviceDuration, existingBookings } = params;
    const dayOfWeek = date.getDay() // 0=Domingo ... 6=Sabado
    ;
    // Si el dia esta cerrado (ej: domingo), no hay slots disponibles
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schedule$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDayOpen"])(dayOfWeek)) return [];
    // Obtenemos los bloques de trabajo del dia (ej: [{start:'10:00', end:'14:00'}, ...])
    const blocks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schedule$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getBlocksForDay"])(dayOfWeek);
    const slots = [];
    // Recorremos cada bloque horario del dia
    for (const block of blocks){
        const blockStartMin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schedule$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseTimeToMinutes"])(block.start);
        const blockEndMin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schedule$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseTimeToMinutes"])(block.end);
        // El cursor marca la posicion actual dentro del bloque (en minutos desde medianoche)
        let cursor = blockStartMin;
        // Avanzamos mientras el servicio completo quepa antes del fin del bloque
        while(cursor + serviceDuration <= blockEndMin){
            const slotStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schedule$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["minutesToTime"])(cursor);
            const slotEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schedule$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["minutesToTime"])(cursor + serviceDuration);
            // Verificamos si este slot colisiona con alguna reserva existente
            const hasConflict = existingBookings.some((booking)=>timesOverlap(slotStart, slotEnd, booking.startTime, booking.endTime));
            // Solo agregamos el slot si no tiene conflictos con reservas existentes
            if (!hasConflict) {
                slots.push(slotStart);
            }
            // Avanzamos en intervalos de 15 minutos para ofrecer granularidad al cliente
            cursor += 15;
        }
    }
    return slots;
}
/**
 * Comprueba si dos intervalos de tiempo se solapan.
 *
 * Usa comparacion lexicografica de strings "HH:mm", que funciona correctamente
 * porque el formato con ceros a la izquierda mantiene el orden cronologico.
 *
 * La logica: dos intervalos [s1,e1) y [s2,e2) se solapan si y solo si
 * s1 < e2 AND s2 < e1. Si alguna condicion no se cumple, los intervalos
 * no se cruzan (uno termina antes de que empiece el otro).
 */ function timesOverlap(s1, e1, s2, e2) {
    return s1 < e2 && s2 < e1;
}
}),
"[project]/app/api/available-slots/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.6_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Booking$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Booking.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$BlockedDate$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/BlockedDate.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$BlockedHour$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/BlockedHour.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slots$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/slots.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const dateStr = searchParams.get('date');
        const serviceId = searchParams.get('serviceId');
        if (!dateStr || !serviceId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Se requieren date y serviceId'
            }, {
                status: 400
            });
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Formato de fecha inválido'
            }, {
                status: 400
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbConnect"])();
        const service = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(serviceId);
        if (!service || !service.active) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Servicio no encontrado'
            }, {
                status: 404
            });
        }
        // Check if date is blocked
        const blocked = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$BlockedDate$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            date: dateStr
        });
        if (blocked) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                slots: [],
                blocked: true
            });
        }
        // Get existing bookings for this date (only confirmed/pending ones)
        const existingBookings = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Booking$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            date: dateStr,
            status: {
                $in: [
                    'confirmada',
                    'pendiente'
                ]
            }
        }).select('startTime endTime');
        // Get blocked hours for this date — treat them as fake bookings so slots
        // that overlap with blocked hours are excluded
        const blockedHours = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$BlockedHour$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            date: dateStr
        }).select('startTime endTime');
        const allBlocked = [
            ...existingBookings.map((b)=>({
                    startTime: b.startTime,
                    endTime: b.endTime
                })),
            ...blockedHours.map((bh)=>({
                    startTime: bh.startTime,
                    endTime: bh.endTime
                }))
        ];
        const date = new Date(dateStr + 'T00:00:00');
        // Allow duration override for multi-service bookings (total duration)
        const durationOverride = searchParams.get('duration');
        let effectiveDuration = service.duration;
        if (durationOverride) {
            const parsed = parseInt(durationOverride, 10);
            if (isNaN(parsed) || parsed <= 0) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Duración inválida'
                }, {
                    status: 400
                });
            }
            effectiveDuration = parsed;
        }
        let slots = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slots$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateAvailableSlots"])({
            date,
            serviceDuration: effectiveDuration,
            existingBookings: allBlocked
        });
        // Filter out past time slots if the date is today (Europe/Madrid timezone)
        const nowInSpain = new Date(new Date().toLocaleString('en-US', {
            timeZone: 'Europe/Madrid'
        }));
        const today = `${nowInSpain.getFullYear()}-${String(nowInSpain.getMonth() + 1).padStart(2, '0')}-${String(nowInSpain.getDate()).padStart(2, '0')}`;
        if (dateStr === today) {
            const nowMinutes = nowInSpain.getHours() * 60 + nowInSpain.getMinutes();
            slots = slots.filter((slot)=>{
                const [h, m] = slot.split(':').map(Number);
                return h * 60 + m > nowMinutes;
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            slots,
            blocked: false
        });
    } catch (error) {
        console.error('Error fetching available slots:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Error al obtener horarios'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e0fb7eba._.js.map