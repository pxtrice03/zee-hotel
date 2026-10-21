import express from 'express'
import dotenv from 'dotenv'
import { readFile, writeFile } from './utils/data.js'
import path from 'path'
import { fileURLToPath } from 'url'

// importing routes
import reservationRouter from './routes/route.reservations.js'

// THis loads the '.env' content into 'process.env'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000 // uses 'PORT' value constant if available and 5000 if not

app.use(express.json())

const dirname = path.join(fileURLToPath(import.meta.url))
// Get the actual path to the client folder
const clientDist = path.join(dirname, '..', '..', 'client')
// Use the client folder path to serve it as the project's frontend
app.use(express.static(clientDist))

// Here hepls use all the routes created in the routes folder
app.use('/api/reservations', reservationRouter)
// app.use('/api/rooms', roomsRouter)

app.get('/*splat', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
