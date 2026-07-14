import dotenv from "dotenv"
import path from "path"
import { cwd } from "process"
dotenv.config({path:path.join(process.cwd(), ".env" )})


export default {
    port:process.env.PORT
}
