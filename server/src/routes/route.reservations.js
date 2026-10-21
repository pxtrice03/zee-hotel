import { Router } from 'express'
import { readFile, writeFile } from '../utils/data.js'
import { isBlank, validateReservation, pickFields } from '../utils/validate.js'

const router = Router()

const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Validates :id once for every route that uses it
router.param('id', (req, res, next, value) => {
    const id = Number(value)
    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ error: 'ID invalide.' })
    }
    req.reservationId = id
    next()
})

// GET all reservations
router.get('/', (req, res) => {
    try {
        // Load data
        res.status(200).json(readFile())
    } catch (err) {
        console.error(err)
        res.status(500).json({
            error: 'Erreur lors de la lecture des donnees.'
        })
    }
})

// GET a reservation
router.get('/:id', (req, res) => {
    try {
        const reservation = readFile().find((r) => r.id === req.reservationId)

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation introuvable.' })
        }
        res.status(200).json(reservation)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erreur lors de la lecture des donnees.' })
    }
})

// POST (create) a reservation
router.post('/', (req, res) => {
    const error = validateReservation(req.body)
    if (error) {
        return res.status(400).json({
            error: error
        })
    }

    try {
        // Load data
        const reservations = readFile()

        const newReservation = {
            id: reservations.length ? Math.max(...reservations.map((r) => r.id)) + 1 : 1,
            ...pickFields(req.body),
        }

        // Add the new reservation to the data (array of reservations)
        reservations.push(newReservation)
        // Write to file (in-memory DB)
        writeFile(reservations)

        res.status(201).json({
            message: 'La reservation a ete enregistree.',
            record: newReservation,
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            error: "Erreur lors de l'enregistrement."
        })
    }
})

// PUT (full update)
router.put('/:id', (req, res) => {
    const error = validateReservation(req.body)
    if (error) {
        return res.status(400).json({ error })
    }

    try {
        const reservations = readFile()
        const index = reservations.findIndex((r) => r.id === req.reservationId)

        if (index === -1) {
            return res.status(404).json({ error: 'Reservation introuvable.' })
        }

        const updated = {
            id: req.reservationId,
            ...pickFields(req.body)
        }
        reservations[index] = updated
        writeFile(reservations)

        res.status(200).json({
            message: 'La reservation a ete modifiee.',
            record: updated,
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erreur lors de la modification.' })
    }
})

// DELETE a reservation
router.delete('/:id', (req, res) => {
    try {
        const reservations = readFile()
        const index = reservations.findIndex((r) => r.id === req.reservationId)

        if (index === -1) {
            return res.status(404).json({ error: 'Reservation introuvable.' })
        }

        const [deleted] = reservations.splice(index, 1)
        writeFile(reservations)

        res.status(200).json({
            message: 'La reservation a ete supprimee.',
            record: deleted,
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erreur lors de la suppression.' })
    }
})

export default router
