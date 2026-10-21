export const isBlank = (v) => typeof v !== 'string' || v.trim() === ''

// Returns an error message, or null if the body (from req.body) is valid
export const validateReservation = (body) => {
    const {
        guestName,
        email,
        phone,
        roomType,
        checkIn,
        checkOut,
        guests,
        paymentMethod,
    } = body

    if (
        isBlank(guestName) ||
        isBlank(email) ||
        isBlank(phone) ||
        isBlank(roomType) ||
        isBlank(checkIn) ||
        isBlank(checkOut) ||
        isBlank(paymentMethod) ||
        !Number.isInteger(guests) ||
        guests < 1
    ) {
        return 'Tous les champs doivent avoir des valeurs valides.'
    }

    if (!VALID_EMAIL.test(email)) {
        return 'Adresse email invalide.'
    }

    const inD = new Date(checkIn)
    const outD = new Date(checkOut)

    if (isNaN(inD) || isNaN(outD)) {
        return 'Date invalide.'
    }
    if (outD <= inD) {
        return "La date de depart doit suivre la date d'arrivee."
    }
    return null
}

// Keeps only the known fields (ignores anything extra in the body)
export const pickFields = (body) => {
    return {
        guestName: body.guestName,
        email: body.email,
        phone: body.phone,
        roomType: body.roomType,
        checkIn: body.checkIn,
        checkOut: body.checkOut,
        guests: body.guests,
        paymentMethod: body.paymentMethod,
    }
}
