import { Router } from "express";




// Routes
import torrentRouter from './torrent/torrent.controller'




const router = Router()


// use Router

router.use('/torrent', torrentRouter)


export default router

