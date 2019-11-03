
$.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast?lat=35.867542&lon=-78.752154&units=imperial&appid=c3d8318715b5794788759512c752b645",
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
            // <td><img class="img-fluid" src="http://openweathermap.org/img/wn/10d@2x.png" height='70' width='70'></td>
            console.log("icon", icon);
            console.log("temp", temp);
            console.log("dayOfWeek", dayOfWeek);
            console.log("time", time);
            var row = $("<tr>");
            var td1 = $("<td>");
            var td2 = $("<td>");
            td1.html(dayOfWeek + " " + time + " " + temp + "&#8457;");
            row.append(td1, icon); 
            if (index < 7) {
                $("#test1").append(row);
            } else {
                $("#test2").append(row);
            }
        }
    })
    // var now = moment.unix(response.list[0].dt).format("dddd")
    // console.log("now", now)
})

// .format("dddd, MMMM Do YYYY, h:mm:ss a")

// https://openweathermap.org/forecast5
// https://openweathermap.org/weather-conditions
