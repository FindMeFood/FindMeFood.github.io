function initMap() {
    //Poscicion incial
    var initLocation = {
        lat: 25.6515651,
        lng: -100.2895398
    };
    var restaurante = {
        lat: 25.6531881,
        lng: -100.2934157
    };

    //Inicializar mapa
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: initLocation,
        disableDefaultUI: true,
        styles: [{
                elementType: 'geometry',
                stylers: [{
                    color: '#242f3e'
                }]
            },
            {
                elementType: 'labels.text.stroke',
                stylers: [{
                    color: '#242f3e'
                }]
            },
            {
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#746855'
                }]
            },
            {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#d59563'
                }]
            },
            {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#d59563'
                }]
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{
                    color: '#263c3f'
                }]
            },
            {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#6b9a76'
                }]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{
                    color: '#38414e'
                }]
            },
            {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{
                    color: '#212a37'
                }]
            },
            {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#9ca5b3'
                }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{
                    color: '#746855'
                }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{
                    color: '#1f2835'
                }]
            },
            {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#f3d19c'
                }]
            },
            {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{
                    color: '#2f3948'
                }]
            },
            {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#d59563'
                }]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{
                    color: '#17263c'
                }]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#515c6d'
                }]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{
                    color: '#17263c'
                }]
            }
        ]
    });

    //Declarar marcador inical
    var marker = new google.maps.Marker({
        position: initLocation,
        map: map
    });

    //Crear infoWindow
    var infoWindow = new google.maps.InfoWindow({
        map: map
    });

    //Crear Direcciones
    var directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
    });

    //Intenter HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found');
            map.setCenter(pos);
            marker.setPosition(pos);
            closeAlert();

            // Set destination, origin and travel mode.
            var request = {
                destination: restaurante,
                origin: pos,
                travelMode: 'DRIVING'
            };

            // Pass the directions request to the directions service.
            var directionsService = new google.maps.DirectionsService();
            directionsService.route(request, function(response, status) {
                if (status == 'OK') {
                    // Display the route on the map.
                    directionsDisplay.setDirections(response);
                }
            });

        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        //El buscador no soporta geoLocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    if (browserHasGeolocation) {
        infoWindow.setContent('Error: The Geoloaction service failed.');
    } else {
        infoWindow.setContent('Error: Your browser dosen\'t support geoloaction.');
    }
}

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

$(function() {
    $button = $("#aboveMap img");
    $button.on('click', function(e) {
        //window.alert("picaste");
        snabbt( e.target, {
            rotation: [0, 0, Math.PI * 2],
            easing: 'spring',
            springConstant: 0.3,
            springDeceleration: 0.8,
        });
    });
});
