import path from 'path'
import fs, { read } from 'fs'
import { fileURLToPath } from 'url'

// import.meta.url: gives the URL of the current module
// this line converts the URL into a normal filesystem path
const filename = fileURLToPath(import.meta.url)
// gives the path to this directory
export const dirname = path.dirname(filename)
const filePath = path.join(dirname, 'data', 'reservations.json')

// helper functions
export const readFile = () => {
    const rawData = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(rawData)
}

export const writeFile = (reservations) => {
    fs.writeFileSync(filePath, JSON.stringify(reservations, null, 2), 'utf-8')
}
