var map;
var infoWindow = null;
var markers = [];
var streetViewService;

function initMap() {
    var i;
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.9256538, lng: -73.140943},
        zoom: 10,
        mapTypeControl: false
    });

    infoWindow = new google.maps.InfoWindow();
    for(i = 0; i< vm.venueList().length; i++) {
        var marker = vm.venueList()[i].marker;
        markers.push(marker);
        marker.addListener('click', function() {
            vm.venueList()[i].populateInfoWindow();
            //populateInfoWindow(this, infoWindow);
            //toggleBounce(this, marker);
        });
    }
};


function fourSquareAjaxRequest (venueList) {
	//Foursquare Ajax request
    var fs_client_id = "40OSONYGX0HSIKFX530MESYRMG3R3KBW4XX2A4LQFPDKK1QU";
    var fs_client_secret = "G1NAFV1GFPB1ZGHUYU5WSMK4TXQ2IA2I1SBERUWMQHTV2R1Z";
    var fs_version = "20170330";
    var fs_query = "restaurants";
    var fs_ll ="40.9256538, -73.140943";
    var fs_limit = 20;
    var fs_url = "https://api.foursquare.com/v2/venues/search?ll=" + fs_ll + "&query=" + fs_query + "&limit=" + fs_limit + "&client_id=" + fs_client_id + "&client_secret=" +fs_client_secret + "&v=" +fs_version;
    
    $.ajax({
        type: "GET",
        url: fs_url,
        dataType: "jsonp"
    }).done(function (data) {
    	var venues = data.response.venues;
    	//console.log(venues);
    	venues.forEach(function (venue) {
    		venueList.push(new Venue(venue));
    	});
    }).fail(function (jqXHR, textStatus, errorThrown) {
        window.alert("Error");
        console.log("jqXHR: " + jqXHR);
        console.log("textStatus: " + textStatus);
        console.log("errorThrown: " + errorThrown);
    });
}

/*
This function populates the infoWindow when the marker is clicked.
One infoWindow will open at the marker that is clicked, and populate
based on that markers position
*/
// function populateInfoWindow(marker, infoWindow) {
//     if(infoWindow.marker !== marker) {
//         infoWindow.setContent('...loading...');
//         infoWindow.marker = marker;
//         infoWindow.addListener('closeclick', function() {
//             infoWindow.marker = null;
//         });
//     };
// };

var Venue = function(data) {
	var self =  this;
	self.id = data.categories.id;
	self.name = data.name;
	self.formattedAddress = data.location.formattedAddress || "No address provided";
	self.formattedPhone = data.contact.formattedPhone || "No phone provided";
	self.lat = data.location.lat;
	self.lng = data.location.lng;
	self.location = {lat: self.lat, lng: self.lng};

    //marker
    self.marker = new google.maps.Marker({
        position: self.location,
        map: map,
        title: self.name,
        animation: google.maps.Animation.DROP
    }); 

    self.marker.addListener('click', function() {
        self.populateInfoWindow();
        self.toggleBounce();
    });

    self.populateInfoWindow = function() {
        streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, self.marker.position);
                infoWindow.setContent('<div>' +
                                    '<h2>' + self.name + '</h2>' + 
                                    '<h3>' + self.formattedAddress + '</h3>' +  
                                    '<h3>' + self.formattedPhone + '</h3>' + 
                                    '<div id="pano"></div>' +
                                '</div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 10
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                infoWindow.setContent('<div>' +
                                    '<h2>' + self.name + '</h2>' + 
                                    '<h3>' + self.formattedAddress + '</h3>' +  
                                    '<h3>' + self.formattedPhone + '</h3>' +    
                                '</div>');
            }
        }
        streetViewService.getPanoramaByLocation(self.marker.position, radius, getStreetView);
        infoWindow.open(map, self.marker);
    };

    self.toggleBounce = function() {
        if (self.marker.getAnimation() !== null) {
            self.marker.setAnimation(null);
        } else {
            self.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                self.marker.setAnimation(null)
            }, 2000);
        }
    }

}

var viewModel = function() {
	var self = this;
    //this.google = ko.observable(false);
	self.venueList = ko.observableArray();
	fourSquareAjaxRequest(self.venueList);

	//This search is the value from search input text
	self.search = ko.observable(''); 


	// //search text filter function
	// self.searchText = ko.computed(function () {
	// 	var userInput = self.search().toLowerCase();
	// 	for(var i = 0; i<self.venueList().length; i++) {
	// 		if(self.venueList()[i].name.toLowerCase().indexOf(userInput) > -1) {
	// 			console.log("finding ...");
	// 		} else {
	// 			console.log("none");
	// 		}
	// 	}
	// });

	
}
var vm = new viewModel();
ko.applyBindings(vm);


