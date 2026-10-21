import express from 'express'
import dotenv from 'dotenv'
import { readFile, writeFile } from './utils/data.js'
import { isBlank } from './utils/validate.js'
import path from 'path'
import { fileURLToPath } from 'url'

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

app.get('/*splat', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
})

// GET all reservations
app.get('/reservations', (req, res) => {
    const reservations = readFile()

    if(reservations.length === 0) {
        return res.status(204).json({
            message: 'Aucune donnees a charger.'
        })
    }
    res.status(200).json(reservations)
})

// POST (create) a reservation
app.post('/reservations', (req, res) => {
    const {
        fullName: fname,
        email: email,
        phoneNumber: tel,
        roomType: roomType,
        checkInDate: checkInD,
        checkOutDate: checkOutD,
        numberOfGuests: guests,
        paymentMethod: payment
    } = req.body

        if (
            isBlank(fname) ||
            isBlank(email) ||
            isBlank(tel) ||
            isBlank(roomType) ||
            isBlank(checkInD) ||
            isBlank(checkOutD) ||
            isBlank(payment) ||
            !Number.isInteger(guests) ||
            guests < 1
        ) {
            return res.status(400).json({
                error: 'Tous les champs doivent avoir des valeurs valides.'
            })
        }

    // Load data
    const reservations = readFile()

    const newReservation = {
        id: reservations.length ? Math.max(...reservations.map((r) => r.id)) + 1 : 1,
        fullName: fname,
        email: email,
        phoneNumber: tel,
        roomType: roomType,
        checkInDate: checkInD,
        checkOutDate: checkOutD,
        numberOfGuests: guests,
        paymentMethod: payment
    }

    // add new reservation to the array of reservations
    reservations.push(newReservation)
    // save it in the JSON file
    writeFile(reservations)

    res.status(201).json({
        message: "La reservation a ete enregistrer.",
        record: newReservation
    })
})

// GET a reservation by its ID
app.get('/reservations/:id', (req, res) => {
    const id = Number(req.params.id)
    const reservations = readFile()
    
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
