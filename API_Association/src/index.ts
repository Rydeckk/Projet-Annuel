import express from "express";
import { initRoutes } from "./handlers/routes";
import { AppDataSource } from "./database/database";
import { swaggerDocs } from "./swagger/swagger";
import cors from "cors"


const main = async () => {
    const app = express()
    const port = 3000

    try {

        await AppDataSource.initialize()
        console.error("well connected to database")
    } catch (error) {
        console.log(error)
        console.error("Cannot contact database")
        process.exit(1)
    }

    swaggerDocs(app, port)

    app.use(express.json(), cors())
    initRoutes(app)
    
    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })
}

main()