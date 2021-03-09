const axios = require("axios").default;
const notifier = require('node-notifier');
const api = axios.get(
  "https://heb-ecom-covid-vaccine.hebdigital-prd.com/vaccine_locations.json"
);

var time = .1, interval = time*60*1000;
setInterval(() => {
    api.then((res) => {
          const data = res.data.locations
          const locals = data.filter(res => res.city === 'LAREDO');

          locals.forEach(location => {
              if (location.name == 'Zapata Highway H-E-B') {
                notifier.notify({
                  title: 'HEB-Vaccine',
                  message: `Yeahh, we found ${location.openAppointmentSlots} slots available on ${location.name}!`
                });
              }
          });
          // console.log(locals);
      })      
}, interval)
