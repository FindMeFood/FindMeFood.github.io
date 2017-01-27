function initMap() {
    //Poscicion incial
    var initLocation = {lat: 25.6515651, lng: -100.2895398};

    //Inicializar mapa
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: initLocation,   
        disableDefaultUI: true
    });

    //Declarar marcador inical
    var marker = new google.maps.Marker({
        position: initLocation,
        map: map
    });

    //Crear infoWindow
    var infoWindow = new google.maps.InfoWindow({map: map});

    //Intenter HTML5 geolocation
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found');
            map.setCenter(pos);
            marker.setPosition(pos);
        },  function() {
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