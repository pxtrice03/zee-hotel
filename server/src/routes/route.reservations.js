import { Router } from 'express'
import { readFile, writeFile } from '../utils/data.js'
import { validateReservation, pickFields } from '../utils/validate.js'

const router = Router()

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
router.get('/', async (req, res) => {
    try {
        // Load data
        res.status(200).json(await readFile())
    } catch (err) {
        console.error(err)
        res.status(500).json({
            error: 'Erreur lors de la lecture des donnees.'
        })
    }
})

// GET a reservation
router.get('/:id', async (req, res) => {
    try {
        const reservations = await readFile()
        const reservation = reservations.find((r) => r.id === req.reservationId)

        if (!reservation) {
            return res.status(404).json({
                error: 'Reservation introuvable.'
            })
        }
        res.status(200).json(reservation)
    } catch (err) {
        console.error(err)
        res.status(500).json({
            error: 'Erreur lors de la lecture des donnees.'
        })
    }
})

// POST (create) a reservation
router.post('/', async (req, res) => {
    const error = validateReservation(req.body)
    if (error) {
        return res.status(400).json({
            error: error
        })
    }

    try {
        // Load data
        const reservations = await readFile()

        const newReservation = {
            id: reservations.length ? Math.max(...reservations.map((r) => r.id)) + 1 : 1,
            ...pickFields(req.body),
        }

        // Add the new reservation to the data (array of reservations)
        reservations.push(newReservation)
        // Write to file (in-memory DB)
        await writeFile(reservations)

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

// PATCH (partial update)
router.patch('/:id', async (req, res) => {
    const body = req.body
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return res.status(400).json({ error: 'Corps de requete invalide.' })
    }

    // Keep only whitelisted fields that were actually sent
    const changes = Object.fromEntries(
        Object.entries(pickFields(body)).filter(([, v]) => v !== undefined)
    )
    if (Object.keys(changes).length === 0) {
        return res.status(400).json({ error: 'Aucun champ a modifier.' })
    }

    try {
        const reservations = await readFile()
        const index = reservations.findIndex((r) => r.id === req.reservationId)

        if (index === -1) {
            return res.status(404).json({ error: 'Réservation introuvable.' })
        }

        // Merge, then validate the full result with the existing validator
        const updated = { ...reservations[index], ...changes, id: req.reservationId }
        const error = validateReservation(updated)
        if (error) {
            return res.status(400).json({ error })
        }

        reservations[index] = updated
        await writeFile(reservations)

        res.status(200).json({
            message: 'La réservation a été modifiée.',
            record: updated,
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erreur lors de la modification.' })
    }
})

// PUT (full update)
router.put('/:id', async (req, res) => {
    const error = validateReservation(req.body)
    if (error) {
        return res.status(400).json({ error })
    }

    try {
        const reservations = await readFile()
        const index = reservations.findIndex((r) => r.id === req.reservationId)

        if (index === -1) {
            return res.status(404).json({
                error: 'Reservation introuvable.'
            })
        }

        const updated = {
            id: req.reservationId,
            ...pickFields(req.body)
        }
        reservations[index] = updated
        await writeFile(reservations)

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
router.delete('/:id', async (req, res) => {
    try {
        const reservations = await readFile()
        const index = reservations.findIndex((r) => r.id === req.reservationId)

        if (index === -1) {
            return res.status(404).json({ error: 'Reservation introuvable.' })
        }

        const [deleted] = reservations.splice(index, 1)
        await writeFile(reservations)

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
