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
window.onRemoveLoc = onRemoveLoc

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
            const { latitude: lat, longitude: lng } = pos.coords
            onPanTo(lat, lng)
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
function onPanTo(lat = 35.6895, lng = 139.6917) {
    console.log('Panning the Map')
    mapService.panTo(lat, lng)
}

function onRemoveLoc(locId) {
    console.log('Removing a location')
    locService.remove(locId).then(onGetLocs)
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
                    <td class="loc-btns"> 
                    <button onclick="onRemoveLoc('${location.id}')">Remove</button>
                    <button onclick="onPanTo('${location.lat}','${location.lng}')">Go</button>
                    </td>
                </tr>
            </tbody>`
    })
    console.log(locs)
    elTable.innerHTML = strHTMLs
}