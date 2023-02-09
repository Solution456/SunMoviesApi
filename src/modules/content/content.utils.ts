
import {parse} from 'querystring'


import { MAGNET_KEY, MAGNET_SPLIT } from '../../constants'


export const MagnetFromQuery = (query: string) => {
    const parsedMagnet = parse(query)
    return String(parsedMagnet[MAGNET_KEY]).replace(MAGNET_SPLIT,'')
}