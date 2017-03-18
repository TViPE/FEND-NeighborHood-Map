var map;
var markers = [];
var infoWindow = null;


function initMap() {
	var mapOptions = {
		center: {lat: 40.758896 ,lng: -73.985130},
		zoom: 13
	}
	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	infoWindow = new google.maps.InfoWindow();
}

function fourSquareCall(dataArray){
	var url ="https://api.foursquare.com/v2/venues/search?ll=40.758896,-73.985130&query=icecream&radius=5000&client_id=40OSONYGX0HSIKFX530MESYRMG3R3KBW4XX2A4LQFPDKK1QU&client_secret=G1NAFV1GFPB1ZGHUYU5WSMK4TXQ2IA2I1SBERUWMQHTV2R1Z&v=20170203";
	$.ajax({
		method: "GET",
		url: url,
		data: "jsonp"
	}).done(function(response){
		var result = response.response.venues;
		result.foreach(function(item){
			dataArray.push(new Venue(item));
		});
		var bounds = new google.maps.LatLngBounds();
		dataArray().forEach (function (venue) {
            bounds.extend(venue.marker.position);
        });
         google.maps.event.addDomListener(window, 'resize', function() {
            map.fitBounds(bounds);
        });
	}).fail(function(jqXHR, textStatus, errorThrown){
		console.log("Status: " + jqXHR.status);
		console.log("Text Statys" + textStatus);
		console.log("Error: " + errorThrown);
		window.alert("Cannot retrive infomation at this time");
	});
}	

var Venue = function(data){
	var self =  this;
	self.address = data.location.formattedAddress || "No address provided";
	self.lat = data.location.lat;
	self.lng = data.location.lng;
	self.name = data.name;
	self.phone = data.contact.formattedPhone || "No phone number provided";
	self.url = data.url || "No Website provided";

	self.marker = new google.maps.Marker({
		map: map,
		position: {lat: self.lat, lng: self.lng},
		title: self.name,
		animation: google.maps.Animation.DROP
	});

	self.marker.addListener('click',function(){
		self.toggleBounce();
		self.openInfoWindow();
	});

	self.toggleBounce = function() {
		if(self.marker.getAnimation() !== null){
			self.marker.setAnimation() == null;
		} else {
			self.marker.setAnimation(google.maps.Animation.BOUNCE);
		}
	}

	self.openInfoWindow = function() {
		infoWindow.open(map, self.marker);
		infoWindow.setContent('<h1>'+ self.name + '</h1><br>' +
							'<h3>Address: '+ self.address + '</h3><br>' + 
							'<h3>Phone: '+ self.phone + '</h3><br>' + 
							'<h3>Website: <a href="'+self.url+'"></a></h3>');
	}

}

function ViewModel() {
	var self = this;

	
}

