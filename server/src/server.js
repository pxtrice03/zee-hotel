import express from 'express'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// In-memory database
const reservations = [
    {
        id: 1,
        fullName: "Kevyn Rodensia",
        email: "rodensia@gmail.com",
        phoneNumber: "678901234",
        roomType: "Suite",
        checkInDate: "2026-10-18",
        checkOutDate: "2026-10-29",
        numberOfGuests: 3,
        paymentMethod: "Card"
    },
    {
        id: 2,
        fullName: "Mitsourhi Byers",
        email: "mitsourhi@gmail.com",
        phoneNumber: "692826735",
        roomType: "Single Room",
        checkInDate: "2026-09-10",
        checkOutDate: "2026-09-30",
        numberOfGuests: 1,
        paymentMethod: "Mobile Money"
    },
    {
        id: 3,
        fullName: "Vincent Faller",
        email: "vincefaller@gmail.com",
        phoneNumber: "655293409",
        roomType: "Double Room",
        checkInDate: "2026-03-01",
        checkOutDate: "2026-11-03",
        numberOfGuests: 2,
        paymentMethod: "Cash"
    }
]

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Express Server!')
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
