const axios = require("axios").default;
const notifier = require('node-notifier');
const utils = require('./src/utils');

const HEB_URL = 'https://heb-ecom-covid-vaccine.hebdigital-prd.com/vaccine_locations.json';
const SECOND_INTERVAL = .3;
const HTTP_OK = 200;

function notify(arrayOfLocations) {
  const available = arrayOfLocations.reduce((acc, store)=> `${acc}\nWe found ${store.openAppointmentSlots} slots available at '${store.name}'!`,'');
  const message = {
    title: 'COVID Vaccine available!!! ',
    message: available,
    icon: ' 🧬 💉', // Absolute path (doesn't work on balloons)
    sound: true, // Only Notification Center or Windows Toasters
  };
  console.log(`🧬 💉 : ${available}`);

  notifier.notify(message);
}


async function main() {
  try {
    // GET DATA
    const { status, data } = await axios.get(HEB_URL);
    // Validate HTTP CALL
    if (status !== HTTP_OK) {
      console.log('⛔️ Failed to fetch http....  💩 💩 💩 💩');
      return;
    }

    // We are looking for stores with openAppointments
    const listOfAvailability = data.locations
      .filter(stores => stores.city === 'LAREDO' && stores.openAppointmentSlots > 0);

    if (listOfAvailability.length) {
      notify(listOfAvailability);
    } else {
      console.log('COVID is winning.... 🦠 🦠 🦠 🦠 🦠');
    }
  } catch (error) {
    console.log('⛔️ App Crash...', { error });
    process.exit(1);
  }
}
// Init Loop
utils.asyncInterval(main, SECOND_INTERVAL*60*1000);
