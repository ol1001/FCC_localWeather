$(function(){
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
        getWeather(position.coords.latitude, position.coords.longitude);
        $("td.temp").click(switchUnit);
    });
} else {
    alert("Service are not available for your browser");
}
});
function getWeather(lat,lon){
    var apiKey = "&APPID=3bda6e8a5cecea9a62f32bb921018ece";
    var units = "&units=metric";
    var apiCall = "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+apiKey+units;

    $.get( apiCall, function(data) {
        if(!data) alert("Something happened");

        var sumInfo = data;

        $("p.location").text(sumInfo.sys.country+", "+sumInfo.name);
        $("td.temp").prepend('<span id="unit">'+Math.round10(sumInfo.main.temp,-1)+'</span>');
        $("td.pres").text(sumInfo.main.pressure);
        $("td.humi").text(sumInfo.main.humidity);
        detectWeather(sumInfo.weather[0].main);
    });

}
function detectWeather(weather){
    var weatherIcons = {
        "clear": "wi-day-sunny",
        "rain":"wi-day-rain",
        "clouds":"wi-day-cloudy",
        "snow":"wi-day-snow"
    }
    weather = weather.toLowerCase();

    if (weatherIcons[weather]!=undefined){
        $("i.wi").addClass(weatherIcons[weather]);
    }

}
function switchUnit(){
 var currentId = $(this)[0].id,
     currentValue = $(this)[0].firstElementChild.innerHTML,
     newValue = convertUnits(currentId,currentValue);

    if ( currentId == "cels") {
        setUnit($(this),"fahr","&#8457;",newValue);

    } else if ( currentId == "fahr") {
        setUnit($(this),"cels","&#8451;",newValue);
    }
}

function setUnit(object, unit, symbol, value){
    object[0].id = unit;
    object[0].innerHTML = symbol;
    object.prepend('<span id="unit">'+value+'</span>');
}

function convertUnits(unit, value){
  if (unit == "cels") return Math.round10((value*9/5 + 32),-1);
  return Math.round10(((value - 32)*5/9),-1);
}

(function() {
    function decimalAdjust(type, value, exp) {

        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;

        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }

        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));

        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    if (!Math.round10) {
        Math.round10 = function(value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }

})();