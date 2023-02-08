import { Router } from "express";

// Types
import type { SearchRequest } from "./content.types";

// Services
import { searchMovie } from "./content.service";

const router = Router()


router.get('/', async ({query: {searchTerm}}:SearchRequest, res) => {
    try{
        const result = await searchMovie(searchTerm)
        res.status(200).send(result)
    }catch (err){
        res.status(400).send(err)
    }
})


export default router

