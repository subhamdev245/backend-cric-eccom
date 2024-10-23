import mongoose from "mongoose";
import { DB_NAME } from "../utils/constant.js";

export const DBCONNECTION = async (url) => {
    try {
        const connection = await mongoose.connect(`${url}/${DB_NAME}`);
        console.log(`Successfully connected to the database: ${DB_NAME}`);
        return connection;
    } catch (error) {
        console.error(`Connection Error: ${error.message}`);
        throw new Error(`Connection Error: ${error.message}`);
    }
};
