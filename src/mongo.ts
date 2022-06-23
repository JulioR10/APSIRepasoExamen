import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv";

export const connectDB = async (): Promise<Db> => {
    dotenv.config();
    const usr = process.env.USR || "JulioRD";
    const pwd = process.env.PWD || "Julio";
    const dbName: string = process.env.DBNAME || "Recordando2";
    const mongouri: string = `mongodb+srv://${usr}:${pwd}@cluster0.xqzvr.mongodb.net/${dbName}?retryWrites=true&w=majority`;
    const client = new MongoClient(mongouri);

    try {
        await client.connect();
        console.info("MongoDB connected");
        return client.db(dbName);
    } catch (e) {
        throw e;
    }
};