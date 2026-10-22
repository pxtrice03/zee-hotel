import { Router } from "express"
import { readFile, writeFile } from "../utils/data"

const router = Router()

router.get('/', (req, res) => {
    try {
        res.status(200).json(readFile())
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: 'Erreur l\'hors de la lecture des donnees'
        })
    }
})

router.get('/:id', (req, res) => {
    try {
        
    } catch (err) {
        
    }
})