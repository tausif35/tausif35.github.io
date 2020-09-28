// PRE LOADER
$(window).load(function () {
  $(".preloader").fadeOut(2000);
});

//Hide mainDic
var mainDiv = document.getElementsByClassName("mainDiv")[0];
mainDiv.style.display = "none";

const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  cityName = document.getElementById("cityName"),
  countryName = document.getElementById("country"),
  temp = document.getElementById("temp"),
  condition = document.getElementById("condition"),
  conditionimg = document.getElementById("condition-img"),
  feels = document.getElementById("feels-like"),
  pressure = document.getElementById("pressure"),
  time = document.getElementById("time"),
  humidity = document.getElementById("humidity");
var upperhalf = document.getElementsByClassName("upperHalf")[0];

// Search city
function searchCity(e) {
  e.preventDefault();

  //Get search term
  const term = search.value;

  //Check for empty
  if (term.trim()) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?appid=8de8f0a92b0f5bfd9dbe058cb7d2daed&units=metric&q=${term}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.cod == 404) {
          alert("Please enter a valid city!");
          return;
        } else {
          var date = new Date();
          var gmt = data.timezone / 3600;
          var isRound = false;
          if (gmt == Math.floor(data.timezone / 3600)) {
            isRound = true;
          }

          var utcHour = date.getUTCHours();
          var utcminute = date.getUTCMinutes();
          if (gmt >= 12) {
            gmt -= 12;
            utcHour -= 12;
          }
          var hour = utcHour + gmt;
          var minute = utcminute;
          if (!isRound) {
            console.log("entered");
            hour = utcHour + Math.floor(gmt);
            minute =
              utcminute +
              Math.floor((data.timezone - Math.floor(gmt) * 3600) / 60);
            if (minute > 60) {
              hour += 1;
              minute = minute - 60;
            }
          }

          var text = "am";
          if (hour > 12) {
            hour -= 12;
            text = "pm";
          }
          if ((hour > 7 && text == "pm") || (hour < 6 && text == "am")) {
            upperhalf.style.backgroundImage = "url('img/nightimg.svg')";
            cityName.style.color = "white";
            countryName.style.color = "white";
          } else {
            upperhalf.style.backgroundImage = "url('img/dayimg.svg')";
          }

          if (minute < 10) {
            minute = "0" + String(minute);
          }
          var shomoy = hour + ":" + minute + " " + text;
          time.innerText = shomoy;

          cityName.innerText = String(data.name);
          countryName.innerText = String(data.sys.country);
          temp.innerText = String(Math.round(data.main.temp));
          if (data.weather[0].main == "Thunderstorm") {
            data.weather[0].main = "Thunder";
          }
          condition.innerText = String(data.weather[0].main);
          conditionimg.setAttribute(
            "src",
            "http://openweathermap.org/img/wn/" +
              data.weather[0].icon +
              "@2x.png"
          );
          feels.innerText = String(data.main.feels_like.toFixed(2));
          pressure.innerText = String((data.main.pressure / 1000).toFixed(2));
          humidity.innerText = String(data.main.humidity);
          showDiv();
        }
      });
  }

  // Clear search text
  search.value = "";
}

//Div show and hide
function showDiv() {
  mainDiv.style.display = "block";
}

//EventListener
submit.addEventListener("submit", searchCity);
