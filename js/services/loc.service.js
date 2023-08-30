import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const LOCATION_KEY = 'locsDB'

export const locService = {
    getLocs,
    createLoc,
    query,
    get,
    remove,
    save,
}

function query() {
    return storageService.query(LOCATION_KEY)
        .then(locs => locs)
}

function get(locId) {
    return storageService.get(LOCATION_KEY, locId)
}

function remove(locId) {
    return storageService.remove(LOCATION_KEY, locId)
}

function save(loc) {
    if (loc.id) {
        return storageService.put(LOCATION_KEY, loc)
    } else {
        return storageService.post(LOCATION_KEY, loc)
    }
}

// const locs = storageService.query(LOCATION_KEY)
     // { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
     // { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
    
    // console.log("updated locs",locs)

function createLoc(lat, lng, name) {
    return { lat, lng, name }
}



function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}


