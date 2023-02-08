import * as cheerio from 'cheerio'
import axios from 'axios'



import { SEARCH_URL, TORRENT_URL} from '../../constants/index'


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

    const result = data.map(item => {
        const [_, magnetTag, title] = $(item).find('a').toArray()

        const magnetLink = $(magnetTag).attr('href')

        return {
            magnet: magnetLink,
            title: $(title).text()
        }
    })

    // console.log(data)
    
    // const data = $('#index tr')

    // const kek = cheerio.load('<h2 class="title">Hello world</h2>');

    // const data = kek('h2')
    // const $ = cheerio.load('<h2 class="title">Hello world</h2>');

    // const data = $('h2')

    // console.log(data.toArray())

    return result
}