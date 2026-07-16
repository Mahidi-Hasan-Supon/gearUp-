import dotenv from "dotenv"
import path from "path"
import { cwd } from "process"
dotenv.config({path:path.join(process.cwd(), ".env" )})


export default {
    port:process.env.PORT,
    app_url:process.env.APP_URL,
    bcrypt_hash_pass:process.env.BCRYPT_HASH_PASS!
}
