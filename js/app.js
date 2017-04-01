var map;
var infoWindow = null;
var markers = [];
var locations = [
    {title: "testing", location: {lat: 40.9256538, lng: -73.140943}}
    // {title: , location: {lat: , lng: }},
    // {title: , location: {lat: , lng: }},
    // {title: , location: {lat: , lng: }},
    // {title: , location: {lat: , lng: }},

]

function initMap() {
    var i;
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.9256538, lng: -73.140943},
        zoom: 10,
        mapTypeControl: false
    });

    infoWindow = new google.maps.InfoWindow();
    for(i = 0; i< vm.venueList().length; i++) {
        //var position = vm.venueList()[i].location;
        //console.log(position);
        //var title = vm.venueList()[i].name;
        //console.log(title);
        var marker = vm.venueList()[i].marker;
        // var marker = new google.maps.Marker({
        //     position: vm.venueList()[i].marker,
        //     map: map,
        //     title: title,
        //     animation: google.maps.Animation.DROP
        // });

        markers.push(marker);
        marker.addListener('click', function() {
            populateInfoWindow(this, infoWindow);
            toggleBounce(this, marker);
        });
    }
};

/*
This function populates the infoWindow when the marker is clicked.
One infoWindow will open at the marker that is clicked, and populate
based on that markers position
*/
function populateInfoWindow(marker, infoWindow) {
    if(infoWindow.marker !== marker) {
        infoWindow.setContent('...loading...');
        infoWindow.marker = marker;
        infoWindow.addListener('closeclick', function() {
            infoWindow.marker = null;
        });
    };
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
var Venue = function(data) {
	var self =  this;
	self.id = data.categories.id;
	self.name = data.name;
	self.formattedAddress = data.location.formattedAddress;
	self.formattedPhone = data.contact.formattedPhone;
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

    // self.createMarker = ko.computed(function() {
    //     if (vm.google()) {
    //         return self.marker;
    //     }
    // });
}

var viewModel = function() {
	var self = this;
    //this.google = ko.observable(false);
	self.venueList = ko.observableArray();
	fourSquareAjaxRequest(self.venueList);

    //create a marker object


	//console.log(self.venueList());
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


