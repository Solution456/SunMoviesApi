import { Router } from "express";




// Routes
import torrentRouter from './torrent/torrent.controller'
import contentRouter from './content/content.conroller'




const router = Router()


// use Router

router.use('/torrent', torrentRouter)
router.use('/search',contentRouter)


export default router

