import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const LOCATION_KEY = 'locsDB'

export const locService = {
    getLocs,
    createLoc,
    save
}

const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function createLoc(lat, lng, name) {
    return { lat, lng, name }
}


function save(loc) {
    if (loc.id) {
        return storageService.put(LOCATION_KEY, loc)
    } else {
        return storageService.post(LOCATION_KEY, loc)
    }
}

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}


