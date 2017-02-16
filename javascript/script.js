/*
    Eduardo Aguilar Leal
    eduxx77@gmail.com
    Feb,15,2017

    FindMeFood v1.4
*/
//Esconder info RAPIDO
$placeInfo = $('#placeInfo').hide();
//Jquery objects
$placeName = $('#nombre');
$placeImg = $('#imagen');
$placeDescription = $('#descripcion');


//variables globales
var map;
var pos;
var directionsDisplay;
var placesResults;
var gotResults = false;
var markers = [];
var nightStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ff0500"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
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
                radius: 1000,
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

        placesResults = results;
        gotResults = true;

    }
}

function buttonClicked (){

    var randomInt = parseInt(Math.random() * placesResults.length);

    createMarker(placesResults[randomInt]);
    setDirection(placesResults[randomInt]);
    setInfo(placesResults[randomInt]);

}

//Maneja logica y procedimiento para renderizar el camino
function setDirection(location){
    // Set destination, origin and travel mode.
    var request = {
        destination: location.geometry.location,
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

    //delete existing markers
    if(markers.length > 0){
        for(i=0; i<markers.length; i++){
            markers[i].setMap(null);
        }
        markers = [];
    }

    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
    //push marker into markers array
    markers.push(marker);
}

function setInfo(place){

    $placeName.text(place.name);
    // $placeImg.attr('src = ' + place.photos[0]);
    $placeDescription.text('Rating: ' + place.rating);

    $placeInfo.fadeIn();
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
        if(gotResults){
            buttonClicked();
        }
    });
});
