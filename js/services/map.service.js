import { locService } from './loc.service.js'
import { appController } from '../app.controller.js'

export const mapService = {
    initMap,
    addMarker,
    panTo
}

// Var that is used throughout this Module (not global)
var gMap
let geocoder
let marker

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            //Create new geocoder
            geocoder = new google.maps.Geocoder();

            const inputText = document.createElement("input");
            //Create input and btn
            inputText.type = "text";
            inputText.placeholder = "Enter a location";

            const submitButton = document.createElement("input");
            submitButton.type = "button";
            submitButton.value = "Geocode";
            submitButton.classList.add("button", "button-primary");

            gMap.controls[google.maps.ControlPosition.TOP_LEFT].push(inputText);
            gMap.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);

            marker = new google.maps.Marker({
                gMap,
            });

            function clear() {
                marker.setMap(null);
            }

            submitButton.addEventListener("click", () => {
                geocode({ address: inputText.value })
                // appController.onAddLoc(latLng)


            }
            );

            function geocode(request) {
                clear();
                geocoder
                    .geocode(request)
                    .then((result) => {
                        const { results } = result;

                        gMap.setCenter(results[0].geometry.location);
                        const latLng = gMap.center.toJSON()
                        appController.onAddLoc(latLng)
                        marker.setPosition(results[0].geometry.location);
                        marker.setMap(gMap);
                        return results;
                    })
                    .catch((e) => {
                        alert("Geocode was not successful for the following reason: " + e);
                    });
            }

            // Create the initial InfoWindow.
            let infoWindow = new google.maps.InfoWindow({
                content: "Click the map to get Lat/Lng!",
                position: { lat, lng },
            });

            infoWindow.open(gMap);
            // Configure the click listener.
            gMap.addListener("click", (mapsMouseEvent) => {
                const latLng = mapsMouseEvent.latLng.toJSON()
                appController.onAddLoc(latLng)

                infoWindow.close();
                // Create a new InfoWindow.
                infoWindow = new google.maps.InfoWindow({
                    position: mapsMouseEvent.latLng,
                });

                infoWindow.setContent(
                    JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2),
                );
                infoWindow.open(gMap);
            });

            console.log('Map!', gMap)
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyBKEBlCcqQBam9dEJ546vYSv5LC1MxgqZY' //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}