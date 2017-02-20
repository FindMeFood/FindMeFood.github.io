/*
    Eduardo Aguilar Leal
    eduxx77@gmail.com
    Feb,15,2017

    FindMeFood v1.4
*/
//RAPIDLY hide placeInfo
$placeInfo = $('#placeInfo').hide();
//Jquery objects
$placeName = $('#nombre');
$placeImg = $('#imagen');
$placeWebsite = $('#website');
$placeMaps = $('#maps');
$placePhone = $('#phone');
$placeRating = $('#rating');
$alert = $('#alert');

//Global variables
var map; //google map object
var pos; //client position
var service; //places library service object
var directionsDisplay; //direction display object
var placesResults; //resultsObjects array
var gotResults = false; //boolean to enable resaraunt recomendation start
var lastResultIndex = -1; //variable to avoid place RErecomendation
var randomInt = 0; //variable to avoid place RErecomendation
var markers = []; //markerObject array, helps delete them
var nightStyle = [{
        "elementType": "geometry",
        "stylers": [{
            "color": "#f5f5f5"
        }]
    },
    {
        "elementType": "labels.icon",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#616161"
        }]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#f5f5f5"
        }]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#bdbdbd"
        }]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
            "color": "#eeeeee"
        }]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#757575"
        }]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{
            "color": "#e5e5e5"
        }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#9e9e9e"
        }]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
            "color": "#ffffff"
        }]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#757575"
        }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{
            "color": "#dadada"
        }]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#616161"
        }]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#9e9e9e"
        }]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#ff0500"
        }]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [{
            "color": "#e5e5e5"
        }]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [{
            "color": "#eeeeee"
        }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
            "color": "#c9c9c9"
        }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#9e9e9e"
        }]
    }
];

function initMap() {
    //Initial positon
    var initLocation = {
        lat: 25.6515651,
        lng: -100.2895398
    };

    //Initianlise map
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: initLocation,
        disableDefaultUI: true,
        styles: nightStyle
    });

    //Create directions renderer
    directionsDisplay = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true
    });
    directionsDisplay.setOptions({
        polylineOptions: {
            strokeColor: 'black'
        }
    });

    //Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
                //position is a retrived paramter
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                closeAlert();


                var marker = new google.maps.Marker({
                    map: map,
                    position: pos,
                    icon: 'images/MarkerBE.png',
                    animation: google.maps.Animation.DROP
                });

                map.setCenter(pos);

                // Set Places neabry search query
                service = new google.maps.places.PlacesService(map);
                service.nearbySearch({
                    location: pos,
                    radius: 1000,
                    type: ['food']
                }, callback);

            },
            function() {
                handleLocationError(true, map.getCenter());
            });
    } else {
        //Browser dosent suppoort geolocation
        handleLocationError(false, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, pos) {

    if (browserHasGeolocation) {
        $alert.html('<span class="closebtn">&times;</span>' + "Error: The Geoloaction service failed.");
    } else {
        $alert.html('<span class="closebtn">&times;</span>' + "Error: Your browser dosen\'t support geoloaction.");
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

//Function called when button is clicked and verified
function buttonClicked() {

    //loop to avoid reslection
    while (randomInt == lastResultIndex) {
        randomInt = parseInt(Math.random() * placesResults.length);
    }
    lastResultIndex = randomInt;

    //request more details for object
    service.getDetails({
        placeId: placesResults[randomInt].place_id
    }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            createMarker(place);
            setDirection(place);
            setInfo(place);
        }
    });
}

//Manages logci and procedure to render map
function setDirection(location) {
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

//Create marker at place
function createMarker(place) {

    //delete existing markers
    if (markers.length > 0) {
        for (i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    }

    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        icon: 'images/MarkerWE.png',
        animation: google.maps.Animation.DROP
    });
    //push marker into markers array
    markers.push(marker);
}

//Update place info
function setInfo(place) {

    console.log(place);
    //Place Name
    $placeName.text(place.name);

    //Place Photo
    if(place.photos){
        $placeImg.attr("src", place.photos[0].getUrl({'maxWidth': 200, 'maxHeight': 200}));
    }else{
        $placeImg.removeAttr("src");
    }

    //Place Website
    if(place.website){
        $placeWebsite.text("Website").attr("href", place.website);
    }else{
        $placeWebsite.text("");
    }

    //Place Maps
    if(place.url){
        $placeMaps.text("Maps").attr("href", place.url);
    }else{
        $placeMaps.text("");
    }

    //Place Phone
    if(place.international_phone_number){
        $placePhone.text("Phone : " + place.international_phone_number);
    }else{
        $placePhone.text("");
    }

    //Place Rating
    if(place.rating){
        $placeRating.text("Rating : " + place.rating);
    }else{
        $placeRating.text("");
    }



    $placeInfo.fadeIn();
}

//Close "enable location services" alert
function closeAlert() {

    // Get the parent of <span class="closebtn"> (<div class="alert">)
    var div = document.getElementById("alert");

    // Set the opacity of div to 0 (transparent)
    div.style.opacity = "0";

    // Hide the div after 600ms (the same amount of milliseconds it takes to fade out)
    setTimeout(function() {
        div.style.display = "none";
    }, 600);
}

//Function to Rotate image when clciked, snabbt Framework.
function rotateImg(e) {
    //window.alert("rotando imagen")
    snabbt(e.target, 'attention', {
        rotation: [0, 0, Math.PI / 2],
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
        if (gotResults) {
            buttonClicked();
        }
    });
});
