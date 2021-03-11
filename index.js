require("dotenv").config();
const axios = require("axios").default;
const notifier = require("node-notifier");
const path = require('path');
const utils = require("./src/utils");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

const HEB_URL = process.env.HEB_API;
const twilioAccount = process.env.TWILIO_ACCOUNT;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(twilioAccount, twilioAuthToken);

const SECOND_INTERVAL = 0.3;
const HTTP_OK = 200;

function notify(arrayOfLocations) {
<<<<<<< HEAD

  const cacheKeys = myCache.keys();
  const locationKeys = arrayOfLocations.map(x => x.storeNumber);
  const difference = cacheKeys.filter(key => !locationKeys.includes(key))

  myCache.del(difference);
=======
  const availables = arrayOfLocations.filter((location) => {
>>>>>>> 8202ff9f39a42934d230392c3a2ce0760b0710e3
    const value = myCache.get(location.storeNumber);
    if (value !== undefined && value.spots !== location.openAppointmentSlots) {
      if (value.spots !== location.openAppointmentSlots) {
        return location;
      }
    } else {
      myCache.set(location.storeNumber, {
        name: location.name,
        spots: location.openAppointmentSlots,
      });
      return location;
    }
  });

  if (availables.length) {
    const available = availables.reduce(
      (acc, store) =>
        `${acc}\nWe found ${store.openAppointmentSlots} slots available at '${store.name}'!`,
      ""
    );
    const message = {
      title: "COVID Vaccine available!!! ",
      message: `${available} \nLink: https://vaccine.heb.com/scheduler`,
      icon: path.join(__dirname, "HEB-logo.png"), // Absolute path (doesn't work on balloons)
    };
    console.log(`🧬 💉 : ${available}`);

    notifier.notify(message);
    console.log("Twilio SMS");
    twilio(available);
  }
}

function twilio(locations) {
  client.messages
    .create({
      body: `${locations} \nLink: https://vaccine.heb.com/scheduler`,
      from: "+19362288796",
      to: "+528671254624",
    })
    .then((msg) => console.log(msg))
    .catch((err) => console.log("Twilio error: ", err));
}

async function main() {
  try {
    // GET DATA
    const { status, data } = await axios.get(HEB_URL);
    // Validate HTTP CALL
    if (status !== HTTP_OK) {
      console.log("⛔️ Failed to fetch http....  💩 💩 💩 💩");
      return;
    }

    // We are looking for stores with openAppointments
    const listOfAvailability = data.locations.filter(
      (stores) => stores.city === "LAREDO" && stores.openAppointmentSlots > 0
    );

    if (listOfAvailability.length) {
      notify(listOfAvailability);
    } else {
      console.log("COVID is winning.... 🦠 🦠 🦠 🦠 🦠");
    }
  } catch (error) {
    console.log("⛔️ App Crash...", { error });
    process.exit(1);
  }
}
// Init Loop
utils.asyncInterval(main, SECOND_INTERVAL * 60 * 1000);
