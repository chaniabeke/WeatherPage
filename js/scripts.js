const apiKey = "fad5f882cea741b3a2d140257201612";
const forecastDaysCount = 3;

const setup = () =>{
    $("#btnSearchLocation").click(getCurrentWeatherTimeOut);
    $("#btnSearchLocation").click(getWeatherForecastTimeOut);
}

const getCurrentWeatherTimeOut = () => {
    getCurrentWeather();
 setInterval(getCurrentWeather, 60000);
}

const getWeatherForecastTimeOut = () => {
    getWeatherForecast();
    setInterval(getWeatherForecast, 60000);
}

const getCurrentWeather = () =>{
$.ajax({
        url: "http://api.weatherapi.com/v1/current.json?key=" + apiKey + "&q=" + $("#inputLocation").val() ,
        type: "GET",
        success: showCurrentWeatherInfo,
        error: error
    });
}

function showCurrentWeatherInfo(receivedData){
    $("#weatherCurrentLocation").html(receivedData.location.name);
    $("#weatherCurrentDate").html(receivedData.current.last_updated);
    $("#weatherCurrentDegrees").html(receivedData.current.temp_c + "&#8451");
    $("#weatherCurrentImg").attr("src", "https:" + receivedData.current.condition.icon);
}

const error = () => {
    alert("error");
}

const getWeatherForecast = () =>{
    $.ajax({
        url: "http://api.weatherapi.com/v1/forecast.json?key=" + apiKey + "&q=" + $("#inputLocation").val() + "&days=" + forecastDaysCount,
        type: "GET",
        success: showWeatherForecastInfo,
        error: error
    });
}

const showWeatherForecastInfo = (receivedData) => {
    deletePreviousForecastDivs();
    deletePreviousMoreInformationDivs();
    for (let index = 0; index <  receivedData.forecast.forecastday.length; index++) {
        let element = receivedData.forecast.forecastday[index];
        createforecastDiv(element);
    }
}

const createforecastDiv = (element) =>{
    let divWeather = $("<div></div>").addClass("forecastDiv").data("element", element);
    let divMoreInfo = $("<div></div>").addClass("weatherMoreInformationDiv").data("element", element);
    divWeather.addClass("border border-1 border border-light");
    divMoreInfo.hide();
    divWeather.click(function () {
        divMoreInfo.show();
    })
    $("body").append(divWeather);
    $("body").append(divMoreInfo);

    showForecastConditionImg(divWeather);
    showForecastDate(divWeather);
    showForecastConditionText(divWeather);
    showForecastMinTemp(divWeather);
    showForecastMaxTemp(divWeather);

    showMoreWeatherInfo(divMoreInfo);
}

const showForecastConditionImg = (div) =>{
    let data = div.data("element");
    let img = $("<img></img").addClass("forecastImg");
    div.append(img);
    $(".forecastImg").attr("src", "https:" + data.day.condition.icon);
}

const showForecastDate = (div) =>{
    let data = div.data("element");
    let p = $("<p></p>").addClass("forecastDate");
    div.append(p);
    let date = new Date(data.date);
    let dateString = getDateString(date);
    p.html(dateString);
}

const getDateString = (date) => {
    let today = new Date(Date.now());
    if(date.getDate() === today.getDate()){
        return "Today";
    }else{
        let weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        return  weekday[date.getDay()];
    }
}

const showForecastConditionText = (div) =>{
    let data = div.data("element");
    let p = $("<h4></h4>").addClass("forecastConditionText");
    div.append(p);
    p.html(data.day.condition.text);
}

const showForecastMinTemp = (div) =>{
    let data = div.data("element");
    let p = $("<p></p>").addClass("forecastMinTemp");
    div.append(p);
    p.html("Min: " + data.day.mintemp_c + "&#8451");
}

const showForecastMaxTemp = (div) =>{
    let data = div.data("element");
    let p = $("<p></p>").addClass("forecastMaxTemp");
    div.append(p);
    p.html("Max: " + data.day.maxtemp_c + "&#8451");
}

const deletePreviousForecastDivs = () => {
    let forecastDivs = $(".forecastDiv");
    for (let index = 0; index <  forecastDivs.length; index++) {
        forecastDivs[index].remove();
    }
}

const deletePreviousMoreInformationDivs = () => {
    let moreInfDivs = $(".weatherMoreInformationDiv");
    for (let index = 0; index <  moreInfDivs.length; index++) {
        moreInfDivs[index].remove();
    }
}

const showMoreWeatherInfo = (div) => {
    let p = $("<h4></h4>").addClass("moreInformationHeading");
    div.append(p);
    p.html("Extensive information: ");
    showMoreWeatherDate(div);
    showMoreWeatherRainChance(div);
    showMoreWeatherMaxWind(div);
}

const showMoreWeatherDate = (div) =>{
    let data = div.data("element");
    let p = $("<p></p>").addClass("weatherMoreInformationDate");
    div.append(p);
    let date = new Date(data.date).toLocaleDateString();
    p.html("Date: " + date);
}

const showMoreWeatherRainChance = (div) =>{
    let data = div.data("element");
    let p = $("<p></p>").addClass("weatherMoreInformationRainChance");
    div.append(p);
    p.html("Chance of rain: " + data.day.daily_chance_of_rain + "%");
}

const showMoreWeatherMaxWind = (div) =>{
    let data = div.data("element");
    let p = $("<p></p>").addClass("weatherMoreInformationMaxWind");
    div.append(p);
    p.html("Max wind: " + data.day.maxwind_kph + "km/u");
}

$(setup);