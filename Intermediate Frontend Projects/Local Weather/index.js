var unitsTemp = 'C';
var unitsSpeed = 'm/s';
var loc = '';

var getWeatherLoc = function(data) {
    if (data.cod == 200) {
        $("#weather-det").html("Weather in " + data.name + ", " + data.sys.country +
            "<span><br>");
        $("#weather-set").html('<span onClick = "setLoc(false)" id="weather-set">' + '<img src = "http://openweathermap.org/img/w/' + data.weather[0].icon + '.png">' + data.main.temp + "&deg" + unitsTemp + "</span>");

        $("#weather-temp").html("</span>" +
            data.weather[0].description + "<br><br>" + " Captured date: " + convertEpoch(data.dt).toLocaleString() + "</span>");

        $(".weather-info").html("<table class = 'table-responsive'>" +
            "<tr><td>" + "Wind" + "</td><td>" + data.wind.speed + " " + unitsSpeed + "</td>" +
            "<tr><td>" + "Pressure" + "</td><td>" + data.main.pressure + " hPa</td>" +
            "<tr><td>" + "Sunrise" + "</td><td>" + convertEpoch(data.sys.sunrise).toLocaleTimeString() + "</td>" +
            "<tr><td>" + "Sunset" + "</td><td>" + convertEpoch(data.sys.sunset).toLocaleTimeString() + "</td>" +
            "<tr><td>" + "Coordinates" + "</td><td>" + "[" + data.coord.lat + "," + data.coord.lon + "]" +
            "</td>" + "</table>" +
            "<div class = 'text-center'>made by <a href = 'https://www.freecodecamp.com/kelvinabella' target = '_blank'>kelvs</a></div>"
        );

        $("#set-new-loc").html("</span>Set new location</span>");

    } else {
        alert("city not found");
    }
};

function convertEpoch(dt) {
    return new Date(dt * 1000);
}

function setLoc(bool) {
    var url = '';
    var unit = '';
    if (bool) {
        loc = document.getElementById('city').value;
        unitsTemp = "C";
        unitsSpeed = "m/s";
        url = "http://api.openweathermap.org/data/2.5/weather?q=" + loc + "&appid=8bd780375531bfd7629fbc302bd7793f&units=metric";
        $("#def-loc").html('<span id = "set-def-loc">Set default location</span>');
        $("#unhide").hide();
        $("#def-loc").show();
    } else {
        if (unitsTemp == 'C') {
            unitsTemp = "F";
            unitsSpeed = "mi/hr";
            unit = "imperial";
        } else {
            unitsTemp = "C";
            unitsSpeed = "m/s";
            unit = "metric";
        }
        if (loc != '') {
            url = "http://api.openweathermap.org/data/2.5/weather?q=" + loc + "&appid=8bd780375531bfd7629fbc302bd7793f&units=" + unit;
        } else {
            loc = '';
            url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=8bd780375531bfd7629fbc302bd7793f&units=" + unit;
        }
    }

    $.getJSON(url, getWeatherLoc);
}

$(document).ready(function() {

    $.getJSON('https://ipinfo.io', function(data) {
        var arr = data.loc.split(',');
        lat = arr[0];
        lon = arr[1];
        $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=8bd780375531bfd7629fbc302bd7793f&units=metric", getWeatherLoc);

        $("#set-new-loc").click(function() {
            $("#unhide").html('<form >Enter city: <input type = "text" name="city" id = "city" required><button type = "button" id = "revert" onclick = "setLoc(true)">Refresh</button></form>');
            $("#unhide").show();
        });

        $("#def-loc").click(function() {
            loc = ''
            unitsTemp = "F";
            setLoc(false);
            $("#def-loc").hide();
        });
    });
});
