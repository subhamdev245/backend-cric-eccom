import 'dotenv/config'

import mongoose from 'mongoose';
import { DBCONNECTION } from './DB/index.js';
import { app } from './app.js'; 
import { DB_NAME } from './utils/constant.js';




DBCONNECTION(process.env.DATABASE_CONNECTION_STRING)
    .then(() => {
        app.on("error", (error) => {
            console.log("ERRR: ", error);
            throw error
        })

        app.listen(process.env.PORT || 8087, () => {
            console.log(`Server is listening on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to the database:', err);
    });
