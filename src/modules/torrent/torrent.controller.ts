import { Router, Request, Response, NextFunction } from "express";
import WebTorrent, {Torrent, TorrentFile} from 'webtorrent'

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

router.get('/remove/:magnet', (req: Request, res: Response) => {
  const magnet = req.params.magnet

  client.remove(magnet)
})

router.get('/add/:magnet', (req: Request, res: Response) => {
    const magnet = req.params.magnet

    console.log(magnet)
  
    client.add(magnet, torrent => {
      const files = torrent.files.map(data => ({
        name: data.name,
        length: data.length
      }))
  
      res.status(200).send(files)
    })
  })


router.get('/stats', (req:Request, res:Response) => {
    state.progress = Math.round(client.progress * 100 *100) / 100
    state.downloadSpeed = client.downloadSpeed
    state.ratio = client.ratio

    res.status(200).send(state)
    
})


// Stream 

interface StreamRequest extends Request {
  params: {
    magnet:string
    fileName: string
  }
  headers: {
    range:string
  }
}

interface ErrorWithStatus extends Error {
  status: number
}

router.get('/stream/:magnet/:fileName', (req: StreamRequest, res: Response, next: NextFunction) => {
  
  
  const {
    params: { magnet, fileName},
    headers: { range }
  } = req

  if (!range) {
    const err = new Error('Range is not defined, plese make request from HTML5 Player') as ErrorWithStatus
    err.status = 416
    return next(err)
  }
  console.log('Stream',fileName)

  const torrentFile = client.get(magnet) as Torrent
  let file = <TorrentFile>{}

  for (let i = 0; i < torrentFile.files.length; i++){
    const currentTorrentPiece = torrentFile.files[i]
    if (currentTorrentPiece.name === fileName) {
      file = currentTorrentPiece
    }
  }

  const fileSize = file.length
  const [startParsed, endParsed] = range.replace(/bytes=/, '').split('-')

  const start = Number(startParsed)
  const end = endParsed ? Number(endParsed) : fileSize - 1

  const chunkSize = end - start + 1

  let ext = fileName.slice(file.length - 3)
  console.log('Extension',ext)
  // let content = ''
  // if (ext === 'avi')
  //   content = 'video/x-msvideo'
  // else if (ext === 'mkv')
  //   content = 'video/x-matroska'
  // else
  //   content = 'video/mp4'

  // console.log('Stream',content)



  

  const headers = {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
    'Content-Type': 'video/x-matroska'
  }

  res.writeHead(206, headers)

  const streamPositions = {
    start,
    end
  }

  const stream = file.createReadStream(streamPositions)

  stream.pipe(res)

  stream.on('error', err => {
    return next(err)
  })
  

})


export default router