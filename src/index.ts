import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import cors from 'cors'
import dotenv from 'dotenv'


// routes
import router from './modules/index'



dotenv.config()

const app: Express = express()
app.use(cors())
app.use(express.json())
app.use('/',router)


app.get('/', (req:Request, res:Response) => {
    res.send({Hello: 'World'})
})

const server = createServer(app)
const wss = new WebSocketServer({server})


const port = process.env.SERVER_PORT

wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
      console.log('received: %s', data);
    });
  
    ws.send('something');
  });
  
  
  
try{
    server.listen(port, function () {
    console.log(`⭐️[server]: Server is running at http://localhost:${port}`)
    });
}catch(er){
    console.log(er)
}




//   const start = () => {
//     try{
//         app.listen(port, () => {
//             console.log(`⭐️[server]: Server is running at http://localhost:${port}`)
//         })
//     } catch(er){
//         console.log(er)
//     }
// }

// start()