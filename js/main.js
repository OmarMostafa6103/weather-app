let finalResponse;
let hourlyChart1=[];
let hourlyChart2=[];
let hourlyChart3=[];
let city = document.getElementById("city");

////// search for another city weather
document.getElementById("submit").addEventListener('click',function(){
    getWeather(city.value);
});

getWeather();

//////////// connect Weather API
async function getWeather(city="london"){
    let response =await fetch(`https://api.weatherapi.com/v1/forecast.json?key=9194b0abba904c169cc172106241101%20&q=${city}&days=3&aqi=no&alerts=no`)
    if(response.ok ==true){
        finalResponse = await response.json();
        displayData();
    }else{
        console.log("problem");
    }
}

async function displayData(){
    let cartona=``;
    for(let i=0; i < 3 ; i++){
        cartona+=`
        <div id="index${i}" class="carousel-item content${i+1} text-white pt-2">
            <div class="row">
                <div class="col-3 pt-2">
                    <h1>${getWeekday(finalResponse.forecast.forecastday[i].date)}</h1>
                    <p class="mb-0">${finalResponse.forecast.forecastday[i].date}</p>
                    <p>${finalResponse.location.name} , ${finalResponse.location.country}</p>
                </div>
                <div class="col-9">
                    <div>
                        <div ><img src="https:${finalResponse.forecast.forecastday[i].day.condition.icon}" alt="">${finalResponse.forecast.forecastday[i].day.condition.text}</div>
                        <div class="ms-auto">
                            <div class="my-2 w-25"><i class="fa-solid fa-up-long"></i>  ${finalResponse.forecast.forecastday[i].day.maxtemp_c}°C</div>
                            <div class="my-2 w-25"><i class="fa-solid fa-down-long"></i> ${finalResponse.forecast.forecastday[i].day.mintemp_c}°C</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-3 d-flex">
                    <div class="my-auto">
                        <h2 class="fs-1">${finalResponse.forecast.forecastday[i].day.avgtemp_c +" °C "}</h2>
                    </div>
                </div>
                <div class="col-9">
                    <div class="row border-top border-bottom">
                        ${getWeatherDuration(i)}
                    </div>
                </div>
            </div> 
            <div><canvas id="hourlyChart${i+1}" style="max-height:200px;" class="mt-5 mb-3 w-100 text-white"></canvas></div>      
        </div>
        `;
        arrayForChart(i);
    }
        document.getElementById("dataShow").innerHTML = cartona;
        document.getElementById("index0").classList.add("active");
        chartData(hourlyChart1);
        chartData(hourlyChart2);
        chartData(hourlyChart3);
};

function getWeatherDuration(x){
    let cartona=``;
    let durationName=["Morning","Afternoon","Evening","Night"];
    let durationHour=["6","12","18","0"];
    for(let i =0; i<4; i++){
        cartona+=`
            <div class="col-3">
                <p class="mb-0">${durationName[i]}</p>
                <img src="http:${finalResponse.forecast.forecastday[x].hour[durationHour[i]].condition.icon}" alt="">
                <p class="mb-0">${finalResponse.forecast.forecastday[x].hour[durationHour[i]].temp_c} °C</p>
            </div>
        `}
    return cartona;
};

function getWeekday(dateString) {
        const dateObject = new Date(dateString);        
        const weekdayIndex = dateObject.getDay();
        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return weekdays[weekdayIndex];
}
/////////chart
function arrayForChart(x){
    let chartdata=[];
    for(let j= 0; j<24 ; j++){
        chartdata.push(finalResponse.forecast.forecastday[x].hour[j].temp_c);
    }
    if(x==0){
        hourlyChart1=[...chartdata];
    }else if(x== 1){
        hourlyChart2=[...chartdata];
    }else if (x==2){
        hourlyChart3=[...chartdata];
    }
}

function chartData(x){
    const hourlyData = {
        labels: ['12AM', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM',
                 '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM'],
        datasets: [{
            label: 'Hourly Data',
            data: [...x],
            backgroundColor:'rgba(52, 52, 115, 0.728)',
            borderColor: 'rgba(225, 225, 225, 1)',
            pointBackgroundColor:'rgba(225, 225, 225, 1)',
            borderWidth: 2, 
            fill: true, 
        }]
    };
    Chart.defaults.borderColor = 'transparent';
    Chart.defaults.color = 'rgba(225, 225, 225, 0.5)';

        if( x == hourlyChart1){
            displayChart(1);
        }else if( x == hourlyChart2){
            displayChart(2);
        }else if( x == hourlyChart3){
            displayChart(3);
        }

    function displayChart(x){
        const ctx = document.getElementById(`hourlyChart${x}`).getContext('2d');
            const hourlyChart = new Chart(ctx, {
                type: 'line',
                data: hourlyData,
                options: {
                    scales: {
                        x: {
                            type: 'category',
                            labels: hourlyData.labels,
                        },
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
    }};
//////////getting user location
    window.onload = getLocation;
//////////location latitude & longitude
    function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showWeather);
        } else {
          document.getElementById("location").innerHTML = "Geolocation is not supported by this browser.";
        }
      }

      function showWeather(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        getCity(latitude,longitude)
      }

////////////location as city

    function getCity(x,y) {
        const latitude = x;
        const longitude = y;
        const apiKey = '5aae0a8a2395417fb24ba7c9f55e7409';
        const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.results.length > 0) {
                    const city = data.results[0].components.city || "City not found";
                    getWeather(city);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }        