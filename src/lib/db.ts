import mongoose from "mongoose";

/**
 * Cached Mongoose connection.
 *
 * Next.js can re-execute modules in development and in serverless
 * invocations, so we cache the connection promise on `globalThis` to
 * avoid opening a new connection on every request.
 */
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as unknown as {
  _pawcareMongoose?: MongooseCache;
};

const cache: MongooseCache =
  globalForMongoose._pawcareMongoose ?? { conn: null, promise: null };

globalForMongoose._pawcareMongoose = cache;

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_URI is not defined. Copy .env.example to .env.local and add your MongoDB Atlas connection string."
    );
  }

  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, { maxPoolSize: 10 }).then((m) => m);
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

/**
 * Returns the native MongoDB `Db` handle that belongs to the SAME
 * Mongoose connection. Better Auth's official MongoDB adapter uses this
 * handle, so we never need a second database connection.
 */
export async function getDatabase(): Promise<mongoose.mongo.Db> {
  const conn = await connectDB();
  return conn.connection.getClient().db();
}
