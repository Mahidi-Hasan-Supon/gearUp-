import cookieParser from "cookie-parser"
import express , {Application, Request, Response} from "express"
import cors from "cors"
import config from "./config"
import { authRouter } from "./modular/auth/auth.route"
import { categoryRouter } from "./modular/category/category.route"
import { gearRouter } from "./modular/gear/gear.route"
import { rentalRouter } from "./modular/rentals/rental.route"
import { reviewRouter } from "./modular/reviews/review.route"
import { providerRouter } from "./provider/provider.route"
import { notFound } from "./middleware/notFound"
import { globalErrorHandler } from "./middleware/globalErrorHandler"
import { adminRouter } from "./modular/admin/admin.route"

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
app.use("/api/gear", gearRouter)
app.use("/api/rental" , rentalRouter)
app.use("/api/reviews" , reviewRouter)
app.use("/api/provider" , providerRouter)
app.use("/api/admin" , adminRouter)


app.use(notFound)

app.use(globalErrorHandler)



export default app

