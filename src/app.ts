import cookieParser from "cookie-parser"
import express , {Application} from "express"
import cors from "cors"
import config from "./config"
import { authRouter } from "./modular/auth/auth.route"
import { categoryRouter } from "./modular/category/category.route"
import { gearRouter } from "./modular/gear/gear.route"
import { rentalRouter } from "./modular/rentals/rental.route"
import { reviewRouter } from "./modular/reviews/review.route"

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



export default app

