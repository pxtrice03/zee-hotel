import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import fs, { read } from 'fs'
import { fileURLToPath } from 'url'

// THis loads the '.env' content into 'process.env'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000 // uses 'PORT' value constant if available and 5000 if not

app.use(express.json())

// import.meta.url: gives the URL of the current module
// this line converts the URL into a normal filesystem path
const filename = fileURLToPath(import.meta.url)
// gives the path to this directory
const dirname = path.dirname(filename)
const filePath = path.join(dirname, 'data', 'reservations.json')

// helper functions
const readFile = () => {
    const rawData = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(rawData)
}

const writeFile = (reservations) => {
    fs.writeFileSync(filePath, JSON.stringify(reservations, null, 2), 'utf-8')
}

app.get('/', (req, res) => {
    res.send('Express Server!')
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
    const { fname, email, tel, roomType, checkInD, checkOutD, guests, payment } = req.body

    if(
        typeof fname === 'string' ||
        fname.trim() === '' ||
        email.trim() === '' ||
        tel.trim() === '' ||
        roomType.trim() === '' ||
        checkInD.trim() === '' ||
        checkOutD.trim() === '' ||
        !Number.isInteger(guests) ||
        guests < 1 ||
        payment.trim() === ''
    ) {
        return res.status(400).json({
            message: 'Tous les champs doivent avoir des valeurs valide.'
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
