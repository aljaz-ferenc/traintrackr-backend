import mongoose, { type Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;
console.log(MONGODB_URL);

interface MongooseConnection {
	conn: Mongoose | null;
	promise: Promise<Mongoose> | null;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	cached = (global as any).mongoose = {
		conn: null,
		promise: null,
	};
}

export const connectToDatabase = async () => {
	if (cached.conn) return cached.conn;
	if (!MONGODB_URL) throw new Error("Missing MONGODB_URL");

	cached.promise =
		cached.promise ||
		mongoose.connect(MONGODB_URL, {
			dbName: "traintrackr",
			bufferCommands: false,
		});

	cached.conn = await cached.promise;

	return cached.conn;
};
