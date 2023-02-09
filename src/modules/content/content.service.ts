import * as cheerio from 'cheerio'
import axios from 'axios'



import { SEARCH_URL, TORRENT_URL} from '../../constants/index'
import { MagnetFromQuery } from './content.utils'

export const searchMovie = async (searchTerm: string) => {
    
    const searchResult = await axios.get(SEARCH_URL+searchTerm, {
        proxy:{
            protocol: 'http',
            host: '13.95.173.197',
            port: 80,
            
        }
    })

    // console.log(searchResult)


    const $ = cheerio.load(searchResult.data)
    const data = $('#index tr').toArray()

    return data
        .map(item => {
            const [_, magnetTag, title] = $(item).find('a').toArray()

            const torrentUrl = `${TORRENT_URL}${$(title).attr('href')}`
            const magnetLink = $(magnetTag).attr('href')

            return {
                magnet: MagnetFromQuery(magnetLink),
                title: $(title).text(),
                torrentUrl
            }
        }).filter(item => item.title)
}