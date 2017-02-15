/*
    Eduardo Aguilar Leal
    eduxx77@gmail.com
    Feb,15,2017

    FindMeFood v1.4
*/

//variables globales
var map;
var pos;
var directionsDisplay;
var rPlaces;
var nightStyle = [
    {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
    {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
    {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
    {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{color: '#263c3f'}]
    },
    {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#6b9a76'}]
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#38414e'}]
    },
    {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{color: '#212a37'}]
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{color: '#9ca5b3'}]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#746855'}]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{color: '#1f2835'}]
    },
    {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{color: '#f3d19c'}]
    },
    {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{color: '#2f3948'}]
    },
    {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{color: '#17263c'}]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#515c6d'}]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#17263c'}]
    }
];

function initMap() {
    //Poscicion incial
    var initLocation = {lat: 25.6515651, lng: -100.2895398};

    //Inicializar mapa
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: initLocation,
        disableDefaultUI: true,
        styles: nightStyle
    });

    //Crear Direcciones
    directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
    });

    //Intenter HTML5 geolocation
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            //position is retived paramter
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            closeAlert();

            //Crear infoWindow
            var infoWindow = new google.maps.InfoWindow({map: map});

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found');
            map.setCenter(pos);
            //marker.setPosition(pos);

            // Set Places
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                location: pos,
                radius: 500,
                type: ['food']
            }, callback);

        },
        function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    }else{
        //El buscador no soporta geoLocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    if(browserHasGeolocation){
        infoWindow.setContent('Error: The Geoloaction service failed.');
    }else{
        infoWindow.setContent('Error: Your browser dosen\'t support geoloaction.');
    }
}

//calbback MUST be used when requesting locations, service.nearbySearch(request,callback);
//handle the results object and google.maps.places.PlacesServiceStatus response.
function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {

        var randomInt = parseInt(Math.random() * results.length);

        // console.log('Results.lenght es ' + results.length);
        // console.log('random numero es ' + randomInt);
        // console.log(results[randomInt].place_id);
        // console.log(results[randomInt]);

        createMarker(results[randomInt]);
        setDirection(results[randomInt]);
    }
}

//Maneja logica y procedimiento para renderizar el camino
function setDirection(location){
    // Set destination, origin and travel mode.

    var request = {
        destination: location.vicinity,
        origin: pos,
        travelMode: 'DRIVING'
    };

    // Pass the directions request to the directions service.
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function(response, status) {
        // console.log(response);
        // console.log('status = ' + status);
        if (status == 'OK') {
            // Display the route on the map.
            directionsDisplay.setDirections(response);
        }
    });
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
}

//Close "enable location services" alert
function closeAlert(){

    // Get the parent of <span class="closebtn"> (<div class="alert">)
    var div = document.getElementById("alert");

    // Set the opacity of div to 0 (transparent)
    div.style.opacity = "0";

    // Hide the div after 600ms (the same amount of milliseconds it takes to fade out)
    setTimeout(function(){ div.style.display = "none"; }, 600);
}

//Function to Rotate image when clciked, snabbt Framework.
function rotateImg(e){
    //window.alert("rotando imagen")
    snabbt( e.target, 'attention', {
        rotation: [0, 0, Math.PI/2],
        springConstant: 1.9,
        springDeceleration: 0.9,
    });
}

//Manage trigger events with Jquey
$(function() {

    $closebtn = $('.closebtn').on('click', function() {
        closeAlert();
    });

    $button = $("#aboveMap img");
    $button.on('click', function(e) {
        //window.alert("picaste");
        rotateImg(e);
    });
});
