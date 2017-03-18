function initMap() {
	var placeId = []; //returned from the API
	var allLatlng = []; //returned from the API
	var allMarkers = []; //returned from the API
	var marketName = []; //returned from the API
	var infowindow = null;
	var pos;
	var userCords;
	var tempMarkerHolder = [];


	if(navigator.geolocation) {
		function error(err){
			console.warn('Error:' + err.code + ' - ' + err.message);
		}

		function success(pos){
			userCords = pos.coords;
		}

		navigator.geolocation.getCurrentPosition(success, error);
	} else {
		alert('Geolocation is not supported in your browser');
	}

	var mapOption = {
		zoom: 13,
		center: {lat: 40.7142700, lng: -74.0059700}
	}

	//Adding infowindow option
	infowindow = new google.maps.InfoWindow({
		content: "holding..."
	});

	//Fire up Goolge maps and place inside the map div
	map = new google.maps.Map(document.getElementById('map'), mapOption);
	$('#chooseZip').submit(function(){
		var userZip  = $('#textZip').val();
		//console.log('Lat: ' + userCords.latitude);
		// var accessURL;
		// if(userZip){
		// 	accessURL = "https://api.foursquare.com/v2/venues/search?ll=40.7142700,-74.0059700&query=icecream&radius=5000&client_id=40OSONYGX0HSIKFX530MESYRMG3R3KBW4XX2A4LQFPDKK1QU&client_secret=G1NAFV1GFPB1ZGHUYU5WSMK4TXQ2IA2I1SBERUWMQHTV2R1Z&v=20170203";
		// } else {
		// 	accessURL = "";
		// }
	})
}
