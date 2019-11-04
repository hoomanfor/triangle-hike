
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
    }
]

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
    console.log("forecastArr", forecastArr);
    forecastArr.forEach(function(element) {
        // console.log("element.dt", element.dt);
        var dateTime = moment.unix(element.dt);
        var hour = parseInt(dateTime.format("H"));
        // console.log("hour", hour);
        if (index < 12 && hour >= 7 && hour <= 17) {
            index++; 
            console.log(element);
            var dayOfWeek = dateTime.format("ddd").toUpperCase();
            var time = dateTime.format("hA");
            var temp = Math.round(element.main.temp);
            var icon = "<td><img class='img-fluid' src='http://openweathermap.org/img/wn/" + element.weather[0].icon + "@2x.png' height='70' width='70'></td>"
            console.log("icon", icon);
            console.log("temp", temp);
            console.log("dayOfWeek", dayOfWeek);
            console.log("time", time);
            var row = $("<tr>");
            var td = $("<td>");
            td.html(dayOfWeek + " " + time + " " + temp + "&#8457;");
            row.append(td, icon); 
            if (index < 7) {
                $("#forecast-col-1").append(row);
            } else {
                $("#forecast-col-2").append(row);
            }
        }
    })
    // var now = moment.unix(response.list[0].dt).format("dddd")
    // console.log("now", now)
})

// .format("dddd, MMMM Do YYYY, h:mm:ss a")

// https://openweathermap.org/forecast5
// https://openweathermap.org/weather-conditions
