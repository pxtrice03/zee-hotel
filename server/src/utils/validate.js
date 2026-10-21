export const isBlank = (v) => typeof v !== 'string' || v.trim() === ''

// Returns an error message, or null if the body (from req.body) is valid
export const validateReservation = (body) => {
    const {
        fullName,
        email,
        phoneNumber,
        roomType,
        checkInDate,
        checkOutDate,
        numberOfGuests,
        paymentMethod,
    } = body

    if (
        isBlank(fullName) ||
        isBlank(email) ||
        isBlank(phoneNumber) ||
        isBlank(roomType) ||
        isBlank(checkInDate) ||
        isBlank(checkOutDate) ||
        isBlank(paymentMethod) ||
        !Number.isInteger(numberOfGuests) ||
        numberOfGuests < 1
    ) {
        return 'Tous les champs doivent avoir des valeurs valides.'
    }

    if (!VALID_EMAIL.test(email)) {
        return 'Adresse email invalide.'
    }

    const inD = new Date(checkInDate)
    const outD = new Date(checkOutDate)

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
        fullName: body.fullName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        roomType: body.roomType,
        checkInDate: body.checkInDate,
        checkOutDate: body.checkOutDate,
        numberOfGuests: body.numberOfGuests,
        paymentMethod: body.paymentMethod,
    }
}
