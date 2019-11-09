
var firebaseConfig = {
    apiKey: "AIzaSyArXfdNZHzGfI7uOm2Dh74z9FM8EUPxIcg",
    authDomain: "triangle-hike-1572987855111.firebaseapp.com",
    databaseURL: "https://triangle-hike-1572987855111.firebaseio.com",
    projectId: "triangle-hike-1572987855111",
    storageBucket: "triangle-hike-1572987855111.appspot.com",
    messagingSenderId: "348712106018",
    appId: "1:348712106018:web:6387471efac2ee37fa327b"
  };

firebase.initializeApp(firebaseConfig);

var database = firebase.database(); 

var trails = [
    {
        name: "Sycamore Trail",
        park: "William B. Umstead State Park",
        url: "https://www.ncparks.gov/william-b-umstead-state-park/trail/sycamore-trail",
        location: "Raleigh, NC", 
        mi: 7.20,
        km: 11.59,
        p_lat: 35.867542,
        p_lon: -78.752154
    },
    {   
        name: "East Loop Trail",
        park: "Lake Johnson Nature Park",
        url: "https://www.raleighnc.gov/parks/content/ParksRec/Articles/Parks/LakeJohnson.html",
        location: "Raleigh, NC",
        mi: 2.70,
        km: 4.35,
        p_lat: 35.762919,
        p_lon: -78.713816
    }, 
    {
        name: "Neuse River Trail",
        park: "Falls Lake State Recreation Area",
        url: "https://www.ncparks.gov/falls-lake-state-recreation-area",
        location: "Raleigh, NC",
        mi: 27.20,
        km: 43.77,
        p_lat: 35.939955,
        p_lon: -78.580651
    },
    {
        name: "Cox Mountain Trail",
        park: "Eno River State Park",
        url: "https://www.ncparks.gov/eno-river-state-park",
        location: "Durham, NC",
        mi: 4.60,
        km: 7.40,
        p_lat: 36.073853,
        p_lon: -79.006061
    }
]

var myLatLng = {lat: 35.867542, lng: -78.752154};

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 15
    });
$(document).on("click", ".parking-btn", function(event) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        zoom: 20
    });

    var infowindow = new google.maps.InfoWindow({
        content: "35.867542, -78.752154"
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        animation: google.maps.Animation.DROP,
        map: map
        });
        infowindow.open(map, marker);
        marker.addListener("click", function() {
        infowindow.open(map, marker);
        })
    })
$(document).on("click", ".trailhead-btn", function(event) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 35.87185, lng: -78.76085},
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        zoom: 20
    })
    var infowindow = new google.maps.InfoWindow({
        content: "35.87185, -78.76085"
    })
    var marker = new google.maps.Marker({
        position: {lat: 35.87185, lng: -78.76085},
        animation: google.maps.Animation.DROP,
        map: map
        });
        infowindow.open(map, marker);
        marker.addListener("click", function() {
            infowindow.open(map, marker);
        })
    })
}


trails.forEach(function(element) {
    var row = $("<div class='row no-gutters'>");
    console.log("element", element);
    var colOneOfTwo = $("<div class='col-6 bg-dark'>");
    var rowTwo = $("<div class='row no-gutters text-center m-1'>");
    var colOneOfThree = $("<div class='col bg-primary text-light mr-1'>");
    colOneOfThree.html("<h3 class='bg-primary'>" + element.name + "</h3>" + 
    "<img src='assets/images/trail-1-250x200.jpg'>" + 
    "<p>" + element.park + "</p>" +
    "<p>" + element.location + "</p>" +
    "<p>" + element.mi + "mi / " + element.km + "</p>" + 
    "<button type='button' class='btn btn-dark parking-btn'>Parking</button>" + 
    "<button type='button' class='btn btn-dark trailhead-btn'>Trailhead</button>");
    var colTwoOfThree = $("<div class='col bg-success text-light'>");
    colTwoOfThree.html("<table><tbody id='forecast-col-1'></tbody></table>");
    var colThreeOfThree = $("<div class='col bg-success text-light'>");
    colThreeOfThree.html("<table><tbody id='forecast-col-2'></tbody></table>");
    var colTwoOfTwo = $("<div class='col-6 pr-1 py-1 bg-dark'>")
    colTwoOfTwo.html("<div id='map'></div>")
    rowTwo.append(colOneOfThree, colTwoOfThree, colThreeOfThree);
    colOneOfTwo.append(rowTwo);
    row.append(colOneOfTwo, colTwoOfTwo);
    $("#test").append(row);
})



var key = "c3d8318715b5794788759512c752b645";
var lat = trails[0].p_lat;
var lon = trails[0].p_lon;

$("#name").html(trails[0].name);
$("#park").html("<a style='color: white' href='" + trails[0].url + "' target='_blank'>" + trails[0].park + "</a>");
$("#location").html(trails[0].location);
$("#distance").html(trails[0].mi + "mi / " + trails[0].km + " km");

$.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + key,
    method: "GET"
}).then(function(response) {
    var index = 0; 
    var forecastArr = response.list;
    // console.log("forecastArr", forecastArr);
    forecastArr.forEach(function(element) {
        // console.log("element.dt", element.dt);
        var dateTime = moment.unix(element.dt);
        var hour = parseInt(dateTime.format("H"));
        // console.log("hour", hour);
        if (index < 10 && hour >= 7 && hour <= 17) {
            index++; 
            // console.log(element);
            var dayOfWeek = dateTime.format("ddd").toUpperCase();
            var time = dateTime.format("hA");
            var temp = Math.round(element.main.temp);
            var icon = "<td><img class='img-fluid' src='http://openweathermap.org/img/wn/" + element.weather[0].icon + "@2x.png' height='70' width='70'></td>"
            // console.log("icon", icon);
            // console.log("temp", temp);
            // console.log("dayOfWeek", dayOfWeek);
            // console.log("time", time);
            var row = $("<tr data-toggle='modal' data-target='#exampleModal' class='forecast' data-trail='" + trails[0].name + "'data-unix='"+ element.dt + "'>");
            var td = $("<td>");
            td.html(dayOfWeek + " " + time + "<br>" + " " + temp + "&#8457;");
            row.append(td, icon); 
            if (index < 6) {
                $("#forecast-col-1").append(row);
            } else {
                $("#forecast-col-2").append(row);
            }
        }
    })
})



$(document).on("click", ".forecast", function(event) {
    // console.log("This Works!");
    var trailName = $(this).attr("data-trail");
    var forecastDate = $(this).attr("data-unix");
    forecastDate = moment.unix(forecastDate).format("dddd, MMMM Do YYYY, h:mm a");
    $("#modal-title").html(trailName + "<br>" + forecastDate)
    console.log(forecastDate);
    $(document).on("click", "#join", function(event) {
        event.preventDefault(); 
        // console.log("This Works 2!")
        var hiker = $("#hiker").val().trim();
        var meetup = $("#meetup").val();
        // console.log("hiker", hiker);
        // console.log("meetup", meetup);
        if (hiker) {
            $(".invalid-feedback").css("display", "none");
            $("input").css("border-color", "");
            database.ref("hikers").push({
                hiker: hiker,
                trail: trailName,
                meetup: meetup,
                date_added: firebase.database.ServerValue.TIMESTAMP
            })
        } else {
            $(".invalid-feedback").css("display", "block");
            $("input").css("border-color", "#dc3545");
        }
        $("#hiker").val("");
    })
});


database.ref("hikers").on("child_added", function(snapshot) {
    if (snapshot.exists()) {
        if (snapshot.val().trail === "Sycamore Trail") {
        console.log(snapshot.val());
        var div = $("<div>");
        var hikerName = snapshot.val().hiker;
        var hikerMeetup = snapshot.val().meetup; 
        div.html(hikerName + " - " + hikerMeetup);
            $("#attendees").append(div);
        }
    }
})





// .format("dddd, MMMM Do YYYY, h:mm:ss a")

// https://openweathermap.org/forecast5
// https://openweathermap.org/weather-conditions
// AIzaSyDHPCmrDYfaXdUyjIQ16ArreXKY9kZKAVI
