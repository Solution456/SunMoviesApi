import { Router, Request, Response } from "express";
import WebTorrent from 'webtorrent'

// init router
const router = Router()


const client = new WebTorrent()


const state = {
    progress: 0,
    downloadSpeed: 0,
    ratio: 0
}

client.on('error', (err:Error) => {
    console.log('err', err.message)
})

client.on('torrent', () => {
    state.progress = Math.round(client.progress * 100 *100) / 100
    state.downloadSpeed = client.downloadSpeed
    state.ratio = client.ratio
})

router.get('/add/:magnet', (req: Request, res: Response) => {
    const magnet = req.params.magnet
  
    client.add(magnet, torrent => {
      const files = torrent.files.map(data => ({
        name: data.name,
        length: data.length
      }))
  
      res.status(200).send(files)
    })
  })


// router.get('/stats', (req:Request, res:Response) => {
//     state.progress = Math.round(client.progress * 100 *100) / 100
//     state.downloadSpeed = client.downloadSpeed
//     state.ratio = client.ratio

//     res.status(200).send(state)
    
// })


export default router