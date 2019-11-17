
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
var key = "c3d8318715b5794788759512c752b645";
var forecastIndex = 0;
var trailsIndex = 0;
var mapIndex = 0;
var unix;
var trailName;
var badgeIndex;
var counter = 0;

var trails = [
    {
        id: 0,
        name: "Sycamore Trail",
        img: "assets/images/trail-1-250x200.jpg",
        park: "William B. Umstead State Park",
        url: "https://www.ncparks.gov/william-b-umstead-state-park/trail/sycamore-trail",
        location: "Raleigh, NC", 
        mi: 7.20,
        km: 11.59,
        p_lat: 35.871792,
        p_lon: -78.761223,
        t_lat: 35.871891,
        t_lon: -78.759225
    },
    {   id: 1,
        name: "East Loop Trail",
        img: "assets/images/trail-2-250x200.jpg",
        park: "Lake Johnson Nature Park",
        url: "https://www.raleighnc.gov/parks/content/ParksRec/Articles/Parks/LakeJohnson.html",
        location: "Raleigh, NC",
        mi: 2.70,
        km: 4.35,
        p_lat: 35.762904,
        p_lon: -78.713821,
        t_lat: 35.762609,
        t_lon: -78.713874
    }, 
    {
        id: 2,
        name: "Neuse River Trail",
        img: "assets/images/trail-3-250x200.jpg",
        park: "Falls Lake State Recreation Area",
        url: "https://www.ncparks.gov/falls-lake-state-recreation-area",
        location: "Raleigh, NC",
        mi: 27.20,
        km: 43.77,
        p_lat: 35.939955,
        p_lon: -78.580651,
        t_lat: 35.939850,
        t_lon: -78.580258
    },
    {
        id: 3, 
        name: "Cox Mountain Trail",
        img: "assets/images/trail-4-250x200.jpg",
        park: "Eno River State Park",
        url: "https://www.ncparks.gov/eno-river-state-park",
        location: "Durham, NC",
        mi: 4.60,
        km: 7.40,
        p_lat: 36.073853,
        p_lon: -79.006061,
        t_lat: 36.075504, 
        t_lon: -79.007502
    }
]


function getForecast(lat, lon, trail, badgeIndex) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + key,
        method: "GET",
        async: false
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
                var icon = "<td class='badge-td'><img class='img-fluid' src='http://openweathermap.org/img/wn/" + element.weather[0].icon + "@2x.png' height='70' width='70'>" + "<span id='" + badgeIndex + "-" + element.dt + "' class='badge badge-info border'></span></td>"
                // console.log("icon", icon);
                // console.log("temp", temp);
                // console.log("dayOfWeek", dayOfWeek);
                // console.log("time", time);
                var row = $("<tr data-toggle='modal' data-target='#exampleModal' class='forecast' data-badgeIndex='" + badgeIndex + "' data-trail='" + trail + "'data-unix='"+ element.dt + "'>");
                var td = $("<td>");
                td.html(dayOfWeek + " " + time + "<br>" + " " + temp + "&#8457;");
                row.append(td, icon); 
                if (index < 6) {
                    $("#forecast-col-1-" + forecastIndex).append(row);
                } else {
                    $("#forecast-col-2-" + forecastIndex).append(row);
                }
            } 
        })
        forecastIndex++;
    })
}

function initMap() {
    trails.forEach(function(element) {
        var map = new google.maps.Map(document.getElementById('map-' + mapIndex), {
            center: {
                lat: element.p_lat,
                lng: element.p_lon
            },
            zoom: 15
        });
        
        mapIndex++; 
    })
}

function getHikers(unix, trailName) {
    database.ref("hikers").once("value", function(snapshot) {
        if (snapshot.exists()) {
            // console.log("trailName", trailName);
            snapshot.forEach(function(childSnapshot) {
                if (childSnapshot.val().unix == unix && childSnapshot.val().trail == trailName) {
                    var row = $("<tr>");
                    var hikerName = "<td>" + childSnapshot.val().hiker + "</td>";
                    var hikerMeetup = "<td>" + childSnapshot.val().meetup + "</td>";
                    row.append(hikerName, hikerMeetup);
                        $("#attendees[data-table='"+ unix +"']").append(row);
                } else {
                    console.log("Does not meet condition.")
                }
            })
        }
    })
}

database.ref("hikers").on("value", function(snapshot) {
    if(snapshot.exists()) {
        snapshot.forEach(function(childSnapshot) {
            $(childSnapshot.val().badge).html("<i class='material-icons'>directions_walk</i>");
        })
    }
})


$(document).on("click", ".parking-btn", function(event) {
    var latitude = $(this).data("p_lat");
    var longitude = $(this).data("p_lon");
    var index = $(this).data("index");
    console.log("latitude", latitude);
    console.log("longitude", longitude);
    console.log("index", index);
    map = new google.maps.Map(document.getElementById('map-' + index), {
        center: {
            lat: latitude,
            lng: longitude
        },
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        zoom: 20
    });

    var infowindow = new google.maps.InfoWindow({
        content: latitude + ", " + longitude
    });

    var marker = new google.maps.Marker({
        position: {
            lat: latitude,
            lng: longitude
        },
        animation: google.maps.Animation.DROP,
        map: map
        });
        infowindow.open(map, marker);
        marker.addListener("click", function() {
            infowindow.open(map, marker);
        })
    });

$(document).on("click", ".trailhead-btn", function(event) {
    var latitude = $(this).data("t_lat");
    var longitude = $(this).data("t_lon");
    var index = $(this).data("index");
    console.log("latitude", latitude);
    console.log("longitude", longitude);
    console.log("index", index);
    map = new google.maps.Map(document.getElementById('map-' + index), {
        center: {
            lat: latitude,
            lng: longitude
        },
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        zoom: 20
    });

    var infowindow = new google.maps.InfoWindow({
        content: latitude + ", " + longitude
    });

    var marker = new google.maps.Marker({
        position: {
            lat: latitude,
            lng: longitude
        },
        animation: google.maps.Animation.DROP,
        map: map
        });
        infowindow.open(map, marker);
        marker.addListener("click", function() {
            infowindow.open(map, marker);
        })
    });

trails.forEach(function(element) {
    var row = $("<div class='row no-gutters'>");
    // console.log("element", element);
    var colOneOfTwo = $("<div class='col-6 bg-dark'>");
    var rowTwo = $("<div class='row no-gutters text-center m-1'>");
    var colOneOfThree = $("<div class='col bg-info text-light mr-1'>");
    colOneOfThree.html("<h3>" + element.name + "</h3>" + 
    "<img class='trail-img' src='" + element.img + "'>" + 
    "<div class='trail-info'>" + 
    "<p>" + "<a class='park-url' href='" + element.url + "' target='_blank'>" + element.park + "</a></p>" +
    "<p>" + element.location + "</p>" +
    "<p>" + element.mi + " mi / " + element.km + " km</p>" + 
    "</div>" +
    "<button type='button' class='btn btn-dark parking-btn' data-p_lat='" + element.p_lat + "' data-p_lon='" + element.p_lon + "' data-index='" + trailsIndex + "'>Parking</button>" + 
    "<button type='button' class='btn btn-dark trailhead-btn' data-t_lat='" + element.t_lat + "' data-t_lon='" + element.t_lon + "' data-index='" + trailsIndex + "'>Trailhead</button>");
    var colTwoOfThree = $("<div class='col bg-success text-light'>");
    colTwoOfThree.html("<table><tbody id='forecast-col-1-" + trailsIndex + "'></tbody></table>");
    var colThreeOfThree = $("<div class='col bg-success text-light'>");
    colThreeOfThree.html("<table><tbody id='forecast-col-2-" + trailsIndex + "'></tbody></table>");
    var colTwoOfTwo = $("<div class='col-6 pr-1 py-1 bg-dark'>");
    colTwoOfTwo.html("<div style='height: 100%;' id='map-" + trailsIndex + "'></div>")
    rowTwo.append(colOneOfThree, colTwoOfThree, colThreeOfThree);
    colOneOfTwo.append(rowTwo);
    row.append(colOneOfTwo, colTwoOfTwo);
    $("#test").append(row);
    getForecast(element.p_lat, element.p_lon, element.name, element.id);
    // console.log("trailsIndex", trailsIndex);
    trailsIndex++;
})

$(document).on("click", ".forecast", function(event) {
    event.preventDefault();
    badgeIndex = $(this).attr("data-badgeIndex");
    trailName = $(this).attr("data-trail");
    var forecastDate = $(this).attr("data-unix");
    unix = $(this).attr("data-unix");
    $("#attendees").attr("data-table", unix);
    $("#attendees[data-table='" + unix + "']").html("");
    forecastDate = moment.unix(forecastDate).format("dddd, MMMM Do YYYY, h:mm a");
    $("#modal-header").html(forecastDate);
    $("#modal-trail").html(trailName);
    console.log(forecastDate);
    getHikers(unix, trailName);
});

$("#join").click("click", function(event) {
    event.preventDefault(); 
    var hiker = $("#hiker").val().trim();
    var meetup = $("#meetup").val();
    // console.log("hiker", hiker);
    // console.log("meetup", meetup);
    if (hiker) {
        $(".invalid-feedback").css("display", "none");
        $("input").css("border-color", "");
        database.ref("hikers").push({
            id: badgeIndex,
            badge: "#" + badgeIndex + "-" + unix, 
            hiker: hiker,
            trail: trailName,
            meetup: meetup,
            date_added: firebase.database.ServerValue.TIMESTAMP,
            unix: unix
        })
    } else {
        $(".invalid-feedback").css("display", "block");
        $("input").css("border-color", "#dc3545");
    }
    $("#hiker").val("");
    $("#attendees[data-table='" + unix + "']").html("");
    getHikers(unix, trailName);
})


// .format("dddd, MMMM Do YYYY, h:mm:ss a")

// https://openweathermap.org/forecast5
// https://openweathermap.org/weather-conditions
// AIzaSyDHPCmrDYfaXdUyjIQ16ArreXKY9kZKAVI
