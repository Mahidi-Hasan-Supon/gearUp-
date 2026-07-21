import { Prisma } from "@prisma/client/extension";
import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";


const port = config.port


async function main() {
  try {
    // await prisma.$connect
    console.log("Database server connected successfully");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log("Error is coming" , error);
    // await prisma.$disconnect()
    process.exit(1)
  }
}

main();
