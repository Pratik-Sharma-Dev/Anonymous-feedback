import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connectionObject: ConnectionObject = {};

async function dbConnect() : Promise<void> {
    if(connectionObject.isConnected) {
        console.log("Already connected")
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URL || '')
        connectionObject.isConnected = db.connections[0].readyState;
        console.log("Connected to MongoDB")

    } catch (error) {
        console.log("Database connection failed", error)
        process.exit(1);
    }
}

export default dbConnect;