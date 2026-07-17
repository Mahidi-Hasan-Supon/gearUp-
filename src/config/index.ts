import dotenv from "dotenv"
import path from "path"
import { cwd } from "process"
dotenv.config({path:path.join(process.cwd(), ".env" )})


export default {
    port:process.env.PORT,
    app_url:process.env.APP_URL,
     database_url: process.env.DATABASE_URL,
    bcrypt_hash_pass:process.env.BCRYPT_HASH_PASS!,
    access_token_secret_key:process.env.ACCESS_TOKEN_SECRET_KEY!,
    refresh_token_secret_key:process.env.REFRESH_TOKEN_SECRET_KEY!,
    access_token_expire_in:process.env.ACCESS_TOKEN_EXPIRE_IN!,
    refresh_token_expire_in:process.env.REFRESH_TOKEN_EXPIRE_IN!
}
