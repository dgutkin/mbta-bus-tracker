
let busMarkers = [];
let stopMarkers = [];
let map;
let timer;

// Initialize the map
async function initMap() {

	const myLatLng = {
		lat: 42.3602180480957,
		lng: -71.05886840820312
	};

	map = new google.maps.Map(document.getElementById("gmp-map"), {
		zoom: 14,
		center: myLatLng,
		fullscreenControl: false,
		zoomControl: true,
		streetViewControl: false
	});

	let locations = await getBusLocations();

    let stops = await getBusStops();

	updateMarkers(locations, "blue");
    updateMarkers(stops, "red");

}

// Request bus data from MBTA and get locations
async function getBusLocations(){

	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=93&include=trip';
	const response = await fetch(url);
	const json = await response.json();

	let busLocations = [];
	for (let i=0; i < json.data.length; i++) {
		a = json.data[i]
		busLocations.push({
			"lat": a.attributes.latitude,
			"lng": a.attributes.longitude
		});
	}

	return busLocations;
}

async function getBusStops() {

    const url = 'https://api-v3.mbta.com/stops?filter[route]=93';
    const response = await fetch(url);
    const json = await response.json();

    let busStops = [];
    for (let i=0; i < json.data.length; i++) {
		a = json.data[i]
		busStops.push({
			"lat": a.attributes.latitude,
			"lng": a.attributes.longitude
		});
	}

    return busStops;

}

// Delete old markers and create new ones
function updateMarkers(locations, colour) {

	(colour == "blue") ? deleteBusMarkers() : deleteStopMarkers();

	for (let i=0; i < locations.length; i++) {
        
        const image = (colour === "blue") ? './blue.png' : './red.png';
        "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
		let marker = new google.maps.Marker({
				position: locations[i],
				map,
				title: "bus",
                icon: image,
                scale: 0.5
			});
        if (colour === "blue") {
            busMarkers.push(marker);
            showBusMarkers();
        } else {
            stopMarkers.push(marker);
            showStopMarkers();
        }
		
	}

}

// Sets the map on all markers in the array.
function setMapOnAll(map, isBus) {
  let markers = (isBus) ? busMarkers : stopMarkers;
for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function hideBusMarkers() {
  setMapOnAll(null, true);
}

// Removes the markers from the map, but keeps them in the array.
function hideStopMarkers() {
    setMapOnAll(null, false);
  }

// Shows any markers currently in the array.
function showBusMarkers() {
  setMapOnAll(map, true);
}

// Shows any markers currently in the array.
function showStopMarkers() {
    setMapOnAll(map, false);
  }

// Deletes all markers in the array by removing references to them.
function deleteBusMarkers() {
  hideBusMarkers();
  busMarkers = [];
}

// Deletes all markers in the array by removing references to them.
function deleteStopMarkers() {
    hideStopMarkers();
    stopMarkers = [];
}

// Update bus locations every 15s
async function trackBuses() {

	const locations = await getBusLocations();
    const stops = await getBusStops();

	console.log("refresh buses...");

	updateMarkers(locations, "blue");
    updateMarkers(stops, "red");

	timer = setTimeout(trackBuses, 15000);

}

// Run the update
trackBuses();