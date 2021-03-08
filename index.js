const axios = require("axios").default;
const player = require('play-sound')();
const api = axios.get(
  "https://heb-ecom-covid-vaccine.hebdigital-prd.com/vaccine_locations.json"
);

var time = .1, interval = time*60*1000;
setInterval(() => {
    api.then((res) => {
          const data = res.data.locations
          const locals = data.filter(res => res.city === 'LAREDO');

          locals.forEach(location => {
              if (location.openAppointmentSlots = 0) {
                player.play('./got_another_one.mp3', (err) => {
                    if (err) console.log(`Could not play sound: ${err}`);
                });
              }
          });
          console.log(locals);
      })      
}, interval)
