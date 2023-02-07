import express, { Express, Request, Response } from "express";
import cors from 'cors'
import dotenv from 'dotenv'


// routes
import router from './modules/index'


dotenv.config()

const app: Express = express()
app.use(cors())
app.use(express.json())
app.use('/',router)


const port = process.env.SERVER_PORT


const start = () => {
    try{
        app.listen(port, () => {
            console.log(`⭐️[server]: Server is running at http://localhost:${port}`)
        })
    } catch(er){
        console.log(er)
    }
}

start()