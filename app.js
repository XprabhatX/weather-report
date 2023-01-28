const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
});

app.post('/', function(req, res){
    console.log(req.body.cityName);
    
    
    console.log('Post request received');

    const query = req.body.cityName;
    const unit = 'metric'
    const apiKey = '7d7fd2b119c93fd04d68eeaf41e00fdc'
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&units=' + unit + '&appid=' + apiKey;
    https.get(url, function(response){
        console.log(response.statusCode);

        response.on('data', function(data){
            const weatherData = JSON.parse(data);
            const temp  = weatherData.main.temp;
            const iconURL = weatherData.weather[0].icon;
            const icon = 'http://openweathermap.org/img/wn/' + iconURL + '@2x.png';
            const weatherDesc = weatherData.weather[0].description;

            res.set("Content-Type", "text/html");

            res.send(`
            <style>
            * {
                font-family: sans-serif;
            }
            body {
                background-image: linear-gradient(45deg, rgb(232, 69, 151), rgb(235, 51, 51));
                color: rgb(230,230,230);
            }
            .weather {
                font-size: 2rem;
            }
            .temprature {
                font-size: 3rem;
            }
            .icon {
                border: 2px solid white;
                border-radius: 50%;
            }
            </style>

            <h3 class="weather">The weather is currently ${weatherDesc} </h3>
            <h1 class="temprature">The temprature in query is ${temp} degree Celcius.</h1>
            <img class="icon" src=${icon}>
            `);
        })
    });
});

app.listen(3000, function(){
    console.log('Server started running on port 3000');
});