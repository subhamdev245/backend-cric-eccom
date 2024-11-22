import 'dotenv/config'
import express, { json, urlencoded} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from "./src/router/auth.router.js"
import cateoryRouter from "./src/router/category.route.js"
import productROuter from "./src/router/product.route.js"
import cartRouter from './src/router/cart.router.js'
export const app = express()

app.use(cors({
    origin : 'http://localhost:5173/',
    credentials : true ,
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
app.use("/api/v1/cart",cartRouter)
export default app