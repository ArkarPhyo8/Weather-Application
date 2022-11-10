const key = "518d449e2b71408da9523441220211";
// const url = "https://api.weatherapi.com/v1";
// const api_key = "1862342a53d2281f610597f245a7f9a8";
const api_key = "28cf297451e0ca45244de16f79a1f634";
const base_url = "https://api.openweathermap.org/data/2.5";
const img_path = "https://openweathermap.org/img/wn";
let current_weather = [];

const getDate = (unix_timestamp) => {
  const d = new Date(unix_timestamp * 1000);
  return d.toLocaleDateString("en-mm", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
const getCurrentWeather = async (url) => {
  //   const res = await fetch(`${url}/current.json?q=${}&key=${key}`, {
  //     method: "GET",
  //     mode: "cors",
  //     headers: { "Access-Control-Allow-Origin": "*" },
  //   });
  
  const res = await fetch(url, {
    method: "GET",
  });
  console.log(res);
  const data = await res.json();
  console.log(data);
  current_weather.push(data);
  if (res.ok) {
    const { name, main, weather, dt } = data;
    const dc = " &#8451;";
    document.getElementById(
      "today-icon"
    ).src = `${img_path}/${weather[0].icon}.png`;
    document.getElementById("today-condition").innerText = weather[0].main;
    document.getElementById("city-name").innerText = name;
    console.log(getDate(dt));
    document.getElementById("date").innerText = getDate(dt);
    document.getElementById("temp-c").innerText = Math.floor(main.temp);
    document.getElementById("hum_fl").innerHTML = `${
      Math.floor(main.humidity) + dc
    }/${Math.floor(main.feels_like) + dc} `;
  }
};

const HourlyWeatherShow = (item, isNow) => {
  const { dt_txt, weather, main } = item;
  console.log(dt_txt, weather, main);
  let hourFormat = "";

  if (isNow) {
    hourFormat = "Now";
  } else {
    let am_pm = new Date(dt_txt).getHours() >= 12 ? "PM" : "AM";
    let hour = new Date(dt_txt).getHours() % 12 || 12;
    hourFormat = `${hour} ${am_pm}`;
  }
  // hourFormat = isNow ? "Now" : `${hour} ${am_pm}`;
  const div = document.createElement("div");
  div.innerHTML = `<div class="weather-hourly">
      <p>${hourFormat}</p>
      <img
        src="${img_path}/${weather[0].icon}.png"
        alt="icon"
      />
      <p>${Math.floor(main.temp)}&#8451;</p>
    </div>`;
  console.log(document.getElementsByClassName("weather-data-list"));
  document.getElementsByClassName("weather-data-list")[0].appendChild(div);
};
const getHourlyWeather = async (url) => {
  // api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
  // `${base_url}/forecast?q=${city}&units=metric&appid=${api_key}`
  const res = await fetch(url, {
    method: "GET",
  });

  const data = await res.json();
  console.log({ hourly: res });
  if (res.ok) {
    console.log({ hourly: data });
    const { list } = data;
    // 1.loop
    //* compare hour
    // 3 getArrindex number
    let startPoint;
    for (let i = 0; i < list.length; i++) {
      const { dt_txt } = list[i];
      const time = new Date(dt_txt);
      const nowHour = new Date().getHours();
      if (nowHour < time.getHours()) {
        startPoint = i;
        break;
      }
    }

    const hourlyData = list.splice(startPoint, 5);

    // <div class="weather-hourly">
    //   <p>Now</p>
    //   <img
    //     src="//cdn.weatherapi.com/weather/64x64/day/113.png"
    //     alt="icon"
    //   />
    //   <p>27&#8451;</p>
    // </div>
    current_weather.forEach((item) => {
      HourlyWeatherShow(item, true);
    });
    hourlyData.forEach((item) => {
      HourlyWeatherShow(item, false);
    });
  } else {
    console.log("error");
  }
};

const load = async () => {};

document.addEventListener("DOMContentLoaded", async () => {
  load();
  document.getElementById("frm").onsubmit = async (e) => {
    e.preventDefault();
    document.querySelector(".weather-data-list").innerHTML = "";
    current_weather = [];
    const city = document.getElementById("search").value;

    const currentWeatherUrl =
      base_url + `/weather?q=${city}&units=metric&appid=${api_key}`;
    const hourlyWeatherUrl =
      base_url + `/forecast?q=${city}&units=metric&appid=${api_key}`;
    await getCurrentWeather(currentWeatherUrl);
    await getHourlyWeather(hourlyWeatherUrl);
    document.getElementById("load").classList.remove("loading");
  };
  // console.log(current_weather);
  // document.getElementById("load").classList.remove("loading");
});