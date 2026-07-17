import cookieParser from "cookie-parser"
import express , {Application, NextFunction, Request, Response} from "express"
import cors from "cors"
import config from "./config"
import { prisma } from "./lib/prisma"
import bcrypt from "bcryptjs"
import { authRouter } from "./modular/auth/auth.route"
import { categoryRouter } from "./modular/category/category.route"

const app : Application = express()


app.use(cors({
  origin:config.app_url,
  credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.use("/api/auth" , authRouter)
app.use("/api/category" , categoryRouter)



export default app
