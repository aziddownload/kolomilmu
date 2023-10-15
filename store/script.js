var linksheet = "https://script.google.com/macros/s/AKfycbzcKSmYqoSrG-MA8WkJablyuzKETip89fenhNOIXTr95936CjTmpOYEqZlmN_OGwx86/exec";

// google maps general
var geocoder = new google.maps.Geocoder();
var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();

// Event List Menu
$(".list-menu").click(function(){
  $(".fixed-menu").toggleClass("active");
  return false;
});

// Geo Lokasi
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({ 'location': latlng }, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          var alamat = results[0].formatted_address;
          var kecamatan = "";
          var kabupaten = "";
          var addressComponents = results[0].address_components;
          for (var i = 0; i < addressComponents.length; i++) {
            var component = addressComponents[i];
            for (var j = 0; j < component.types.length; j++) {
              if (component.types[j] === "administrative_area_level_2") {
                kabupaten = component.long_name;
              } else if (component.types[j] === "administrative_area_level_3") {
                kecamatan = component.long_name;
              }
            }
          };
          var kab = kabupaten.split(" ")[1];
          console.log(kab);
          var alamattujuan = "Jl. Berbek Raya No. 26 Berbek Waru Sidoarjo";
          var request = {
            origin: alamat,
            destination: alamattujuan,
            travelMode: 'DRIVING'
          };
          directionsService.route(request, function (result, status) {
            if (status == 'OK') {
              directionsDisplay.setDirections(result);
              console.log(result.routes[0]);
              var km = result.routes[0].legs[0].distance.text;
              console.log(km);
            } else {
              console.log("alamat gagal dimuat");
            }
          });
        } else {
          console.log("Alamat tidak ditemukan");
        }
      } else {
        console.log("Geocode: " + status);
      }
    });
  });
} else {
  // lokasi awal tidak ditemukan
  console.log("Aktifkan Lokasi Anda");
}

