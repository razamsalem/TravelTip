import { utilService } from './util.service.js'

export const locService = {
    getLocs,
    createLoc
}

const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function createLoc(latLng, name) {
    const { lat, lng } = latLng
    const loc = {
        id: utilService.makeId(),
        lat,
        lng,
        name
    }
    locs.unshift(loc)
}

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}


