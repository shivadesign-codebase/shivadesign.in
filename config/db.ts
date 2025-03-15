import mongoose, { Connection } from 'mongoose';

let cachedDB: Connection | null = null;

export default async function connect_db(): Promise<Connection> {
  // Check if there is a cached connection
  if (cachedDB) {
    console.info("Using cached connection!");
    return cachedDB;
  }

  console.info("No connection found! Creating a new one.");

  const uri = process.env.DB_URI;
  const dbName = process.env.DB_NAME;

  if (!uri || !dbName) {
    throw new Error("Missing DB_URI or DB_NAME in environment variables");
  }

  try {
    // Create a new connection using mongoose.connect
    const connection = await mongoose.connect(uri, { dbName });
    console.info(`Connected to MongoDB: ${uri}`);
    
    // Cache the connection
    cachedDB = connection.connection;
    
    return cachedDB;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
