import 'dotenv/config'
import express, { json, urlencoded} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


export const app = express()

app.use(cors({
    origin : '*'
}))
app.use(json({limit:"16kb"}))
app.use(urlencoded({
    extended:'true',
    limit:"16kb"
}))


app.use(cookieParser())

export default app