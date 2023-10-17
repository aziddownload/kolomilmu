var linksheet = "https://script.google.com/macros/s/AKfycbzdJtx5oOvmth_cFHL7n0at5v2qTA3foP9TlsA_Axcbb3atlft0C51jnAtVzAgV1OCr/exec";

// google maps general
var geocoder = new google.maps.Geocoder();
var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();

// Event List Menu
$(".list-menu").click(function(){
  $(".fixed-menu").toggleClass("active");
  return false;
});

// mengambil Lat dan Lng
function formatLatLng(alamat) {
  geocoder.geocode({ 'address': alamat }, function (results, status) {
    console.log(status);
    console.log(results);
    if (status === 'OK' && results.length > 0) {
      var location = results[0].geometry.location;
      console.log(location.lat());
      var lat = location.lat();
      var lng = location.lng();
      var latlng = lat + ":" + lng;
      console.log(latlng);
      return latlng;
    } else {
      return "";
    }
  });
}

// mengambil alamat
function formatAlamat(lat, lng, item) {
  var latlng = new google.maps.LatLng(lat, lng);

  geocoder.geocode({ 'location': latlng }, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        var alamat = results[0].formatted_address;
        item(alamat);
      } else {
        item("");
      }
    } else {
      item("");
    }
  });
}

// mengambil kota/kabupaten
function formatKab(lat, lng) {
  return new Promise(function (resolve, reject) {
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({ 'location': latlng }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          var kabupaten = "";
          var addressComponents = results[0].address_components;
          for (var i = 0; i < addressComponents.length; i++) {
            var component = addressComponents[i];
            for (var j = 0; j < component.types.length; j++) {
              if (component.types[j] === "administrative_area_level_2") {
                kabupaten = component.long_name;
              }
            }
          }
          resolve(kabupaten);
        } else {
          reject("");
        }
      } else {
        reject("");
      }
    });
  });
}
async function mainKab() {
  try {
    var alamat = await formatKab(lat, lng);
    cosole.log(alamat)
  } catch (error) {
  }
}

// mengambil kecamatan
function formatKec(lat, lng) {
  var latlng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({ 'location': latlng }, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        var kecamatan = "";
        var addressComponents = results[0].address_components;
        for (var i = 0; i < addressComponents.length; i++) {
          var component = addressComponents[i];
          for (var j = 0; j < component.types.length; j++) {
            if (component.types[j] === "administrative_area_level_3") {
              kecamatan = component.long_name;
            }
          }
        }
        return kecamatan;
      } else {
        return "";
      }
    } else {
      return "";
    }
  });
}

// Format KM
function formatKM(alamatasal, alamattujuan, item) {
  var request = {
    origin: alamatasal,
    destination: alamattujuan,
    travelMode: 'DRIVING'
  };
  directionsService.route(request, function (result, status) {
    if (status == 'OK') {
      directionsDisplay.setDirections(result);
      var km = result.routes[0].legs[0].distance.text;
      item(km);
    } else {
      item("");
    }
  });
}

// Format Toko
function formatToko(lat, lng, daerah) {
  console.log("cba")
  $.ajax({
    crossDomain: true,
    url: linksheet + "?action=readtoko",
    method: "GET",
    dataType: "jsonp",
    beforeSend: function (data) {
      // sedang proses data
    },
    success: function (data) {
      var item = data.records;
      console.log(item)
      for (i = 0; i < item.length; i++){
        mainKab();
      }
    },
    error: function (error) {
      console.log(error)
    }
  })
}

// Geo Lokasi
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    formatToko(lat, lng);
  });
} else {
  // lokasi awal tidak ditemukan
  console.log("Aktifkan Lokasi Anda");
}
