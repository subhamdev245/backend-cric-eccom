import 'dotenv/config'
import express, { json, urlencoded} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from "./src/router/auth.router.js"
import cateoryRouter from "./src/router/categorie.route.js"
import productROuter from "./src/router/product.route.js"
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


app.use("/api/v1/user",userRouter)
app.use("/api/v1/category",cateoryRouter)
app.use("/api/v1/product",productROuter)

export default app