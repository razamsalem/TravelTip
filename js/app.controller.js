import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

export const appController = {
    onAddLoc,
}

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onAddLoc = onAddLoc

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
        })
        .catch(() => console.log('Error: cannot init map'))

    onGetLocs()
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onAddLoc(latLng) {
    const { lat, lng } = latLng
    const name = promptForName()
    const location = locService.createLoc(lat, lng, name)

    locService.save(location)
        .then(onGetLocs)
}

function promptForName() {
    return prompt('Enter name for location: ')
}

function onGetLocs() {
    locService.query()
        .then(renderLocs)
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
function onPanTo() {
    console.log('Panning the Map')
    mapService.panTo(35.6895, 139.6917)
}

function renderLocs(locs) {
    const elTable = document.querySelector('.location-table')
    let strHTMLs = `
        <thead>
            <th>Name</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Actions</th>
        </thead>`

    locs.map(location => {
        strHTMLs +=
            `<tbody>
                <tr>
                    <td class="loc-name">${location.name}</td>
                    <td class="loc-lat">${location.lat}</td>
                    <td class="loc-lng">${location.lng}</td>
                    <td class="loc-btns">[] | -> </td>
                </tr>
            </tbody>`
    })

    elTable.innerHTML = strHTMLs
}