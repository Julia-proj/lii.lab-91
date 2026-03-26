/**
 * Conexion a MongoDB con patron de cache (singleton).
 *
 * En entornos serverless (como Vercel / Next.js), cada invocacion de funcion
 * puede reutilizar el mismo proceso de Node.js ("warm start"). Sin este cache
 * se crearian multiples conexiones a Mongo en cada peticion, agotando el pool
 * de conexiones. Guardar la conexion en `global` asegura que persista entre
 * invocaciones dentro del mismo proceso.
 */

import mongoose from 'mongoose'

/** Estructura de la cache: guarda la conexion resuelta y la promesa en curso */
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

/**
 * Declaramos la variable en el scope global de Node para que sobreviva
 * al hot-reload de Next.js en desarrollo (donde los modulos se recargan
 * pero `global` permanece).
 */
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined
}

// Si ya existe una cache en global, la reutilizamos; si no, creamos una nueva
const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null }
if (!global.mongooseCache) {
  global.mongooseCache = cached
}

/**
 * Conecta a MongoDB reutilizando la conexion cacheada.
 *
 * - Si ya tenemos una conexion lista (`cached.conn`), la retornamos de inmediato.
 * - Si no hay promesa en curso, iniciamos `mongoose.connect` y la guardamos
 *   para que llamadas concurrentes compartan la misma promesa (evita conexiones duplicadas).
 * - Si la conexion falla, reseteamos `cached.promise` a null para que el proximo
 *   intento vuelva a intentar conectar en lugar de reutilizar una promesa rechazada.
 */
export async function dbConnect(): Promise<typeof mongoose> {
  // Retorno inmediato si ya hay una conexion activa
  if (cached.conn) return cached.conn

  const MONGO_URI = process.env.MONGO_URI
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables')
  }

  // Solo creamos la promesa si no existe — asi multiples llamadas simultaneas
  // esperan la misma conexion en vez de abrir varias
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false, // Desactiva el buffer para fallar rapido si no hay conexion
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (err) {
    // IMPORTANTE: reseteamos la promesa para no quedar atrapados con una
    // promesa rechazada permanentemente. Asi el siguiente intento reintenta la conexion.
    cached.promise = null
    throw err
  }
  return cached.conn
}
