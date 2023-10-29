var apikeyFirebase = "AIzaSyA_daTguV7VFYrt8R1G0mO9JmdMt-cfnT4";
var projectID = "shortlink-97ecc";
var appID = "1:39513375310:web:83a1c8e1e4dff0fbcd391f";
var splitappID = appID.split(":");
var senderID = splitappID[1];

//Url
var url_string = window.location.href;
var urlParameter = new URL(url_string);
var urlHome = urlParameter.origin;

// Firebase Config
const firebaseConfig = {
    apiKey: apikeyFirebase,
    authDomain: projectID+".firebaseapp.com",
    projectId: projectID,
    storageBucket: projectID+".appspot.com",
    messagingSenderId: senderID,
    appId: appID
};
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore(); 

// Set Notifikasi Peringatan
var timeout_notif;
var berhasil = "<div class='peringatan sukses'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z' /></svg></div>";
var gagal = "<div class='peringatan gagal'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z' /></svg></div>";

function notification(o) {
  var informasi = document.getElementById("informasi");
  if (informasi) {
    informasi.parentNode.removeChild(informasi);
  }
  clearTimeout(timeout_notif);
  
  var informasiDiv = document.createElement('div');
  informasiDiv.id = "informasi";
  document.body.appendChild(informasiDiv);
  informasiDiv.innerHTML = o;
  informasiDiv.style.display = "block";

  timeout_notif = setTimeout(function () {
    informasiDiv.style.display = "none";
    setTimeout(function () {
      informasiDiv.parentNode.removeChild(informasiDiv);
    }, 1000);
  }, 4000);
}

// Daftarkan Link
var buttonShortlink = document.getElementById("button-shortlink");
if (buttonShortlink) {
  buttonShortlink.addEventListener("click", function () {
    var urlInput = document.getElementById("urlshorlink");
    var namaInput = document.getElementById("namashortlink");
    var idInput = document.getElementById("prefixshortlink");
    var url = urlInput.value;
    var nama = namaInput.value;
    var id = idInput.value;
    var shortlink = "https://azid45.web.id/" + id;

    if (url == "") {
      notification("Url Shorlink diperlukan");
      return false;
    } else if (nama == "") {
      notification("Nama Shorlink diperlukan");
      return false;
    } else if (id == "") {
      notification("Prefix Shorlink diperlukan");
      return false;
    } else {
      db.collection('datashortlink').add({
        id: id,
        nama: nama,
        url: url,
        shortlink: shortlink
      }).then(function (res) {
        notification(berhasil + "Shortlink Anda Berhasil dibuat " + shortlink);
        var boxOutputLink = document.querySelector(".box-output-link");
        if (boxOutputLink) {
          boxOutputLink.style.display = "block";
        }
        var outputShortlink = document.getElementById("output-shortlink");
        if (outputShortlink) {
          outputShortlink.value = shortlink;
        }
      }).catch(function (e) {
        notification(gagal + "Prefix sudah tersedia, silahkan ganti yang lain");
        console.log(e);
      });
      return false;
    }
  });
}

