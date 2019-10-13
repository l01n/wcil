var thisIsAPlace = false;

function initMap() {

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: { lat: 35.228, lng: -80.840 }
    });


    //AJAX INFO NEEDED HERE 
    //MAKE DYNAMIC
    var contentString = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<div id="bodyContent">' +
        '<p>City: Charlotte</p>' +
        '<p>Salary: $10,000 - $20,000</p>' +
        '<p>Happiness: 4</p>' +
        '<p>Comfort: 3</p>' +
        '<p>Created: 2019-06-12</p>' +
        '</div>' +
        '</div>';

    var clickHandler = new ClickEventHandler(map, origin);

    // Create an array of alphabetical characters used to label the markers.
    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // Add some markers to the map.
    // Note: The code uses the JavaScript Array.prototype.map() method to
    // create an array of markers based on a given "locations" array.
    // The map() method here has nothing to do with the Google Maps API.
    var markers = locations.map(function (location, i) {
        return new google.maps.Marker({
            position: location,
            label: labels[i % labels.length]
        });
    });

    // Add a marker clusterer to manage the markers.
    var markerCluster = new MarkerClusterer(map, markers,
        { imagePath: 'img/m' });

    map.setMapTypeId('terrain');

    //Attach click event handler to the map.
    google.maps.event.addListener(map, 'click', function (e) {

        //Determine the location where the user has clicked.
        var location = e.latLng;

        if (!thisIsAPlace) {
            var marker = new google.maps.Marker({
                position: location,
                map: map
            });

            var formString =
                '<div class="ml-3 mr-3" id="form-content">' +
                '<form action="" method="post">' +
                '<div class="form-check form-check-inline">' +
                '<input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1">' +
                '<label class="form-check-label" for="inlineRadio1">1</label>' +
                '</div>' +
                '<div class="form-check form-check-inline">' +
                '<input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2">' +
                '<label class="form-check-label" for="inlineRadio2">2</label>' +
                '</div>' +
                '<div class="form-check form-check-inline">' +
                '<input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3" disabled>' +
                '<label class="form-check-label" for="inlineRadio3">3 (disabled)</label>' +
                '</div><br/>' +
                '<div class="form-check form-check-inline">' +
                '<input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1">' +
                '<label class="form-check-label" for="inlineRadio1">1</label>' +
                '</div>' +
                '<div class="form-check form-check-inline">' +
                '<input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2">' +
                '<label class="form-check-label" for="inlineRadio2">2</label>' +
                '</div>' +
                '<div class="form-check form-check-inline">' +
                '<input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3" disabled>' +
                '<label class="form-check-label" for="inlineRadio3">3 (disabled)</label>' +
                '</div><br/>' +
                '<div class="form-check form-check-inline">' +
                '<input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1">' +
                '<label class="form-check-label" for="inlineRadio1">1</label>' +
                '</div>' +
                '<div class="form-check form-check-inline">' +
                '<input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2">' +
                '<label class="form-check-label" for="inlineRadio2">2</label>' +
                '</div>' +
                '<div class="form-check form-check-inline">' +
                '<input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3" disabled>' +
                '<label class="form-check-label" for="inlineRadio3">3 (disabled)</label>' +
                '</div><br/>' +
                '</form>' +
                '</div>'

            //e.latLng.lat() = latitude
            //e.latLng.lng() = longitude

            var infoWindow = new google.maps.InfoWindow({
                content: formString,
            });
            infoWindow.open(map, marker);

            var closeBtn = document.getElementsByClassName("gm-ui-hover-effect");



            // //Create a marker and placed it on the map.
            // var marker = new google.maps.Marker({
            //     position: location,
            //     map: map,
            //     animation: google.maps.Animation.DROP
            // });

            // //Attach click event handler to the marker.
            // google.maps.event.addListener(marker, "click", function (e) {
            //     var infoWindow = new google.maps.InfoWindow({
            //         content: formString,
            //     });
            //     infoWindow.open(map, marker);
            // });
        }
        thisIsAPlace = false;
    });

}

var ClickEventHandler = function (map, origin) {
    this.origin = origin;
    this.map = map;
    this.placesService = new google.maps.places.PlacesService(map);
    this.infowindow = new google.maps.InfoWindow;
    this.infowindowContent = document.getElementById('infowindow-content');
    this.infowindow.setContent(this.infowindowContent);

    // Listen for clicks on the map.
    this.map.addListener('click', this.handleClick.bind(this));
};

ClickEventHandler.prototype.handleClick = function (event) {
    console.log('You clicked on: ' + event.latLng);
    // If the event has a placeId, use it.
    if (event.placeId) {

        thisIsAPlace = true;

        // Calling e.stop() on the event prevents the default info window from
        // showing.
        // If you call stop here when there is no placeId you will prevent some
        // other map click event handlers from receiving the event.
        event.stop();
        this.getPlaceInformation(event.placeId);
    }

    //If no event ID, then it calls event listener for marker addition
};

ClickEventHandler.prototype.getPlaceInformation = function (placeId) {
    var me = this;
    this.placesService.getDetails({ placeId: placeId }, function (place, status) {
        if (status === 'OK') {
            me.infowindow.close();
            me.infowindow.setPosition(place.geometry.location);
            me.infowindowContent.children['place-icon'].src = place.icon;
            me.infowindowContent.children['place-name'].textContent = place.name;
            me.infowindowContent.children['place-address'].textContent =
                place.formatted_address;
            me.infowindow.open(me.map);
        }
    });
};

function drop() {
    for (var i = 0; i < markerArray.length; i++) {
        setTimeout(function () {
            addMarkerMethod();
        }, i * 200);
    }
}

var locations = [
    { lat: 35.228, lng: -80.340 },
    { lat: 35.008, lng: -80.740 },
    { lat: 35.328, lng: -80.140 },
    { lat: 35.528, lng: -80.930 },
    { lat: 35.828, lng: -80.420 },
    { lat: 35.728, lng: -80.590 },
    { lat: 35.828, lng: -80.210 },
    { lat: 35.428, lng: -80.350 },
    { lat: 35.328, lng: -80.790 },
    { lat: 35.128, lng: -80.120 },
    { lat: 35.028, lng: -80.790 },
    { lat: 35.258, lng: -80.080 },
    { lat: 35.348, lng: -80.160 },
    { lat: 35.628, lng: -80.820 },
]

