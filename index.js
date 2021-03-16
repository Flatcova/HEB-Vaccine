require("dotenv").config();
const axios = require("axios").default;
const notifier = require("node-notifier");
const path = require('path');
const utils = require("./src/utils");
const NodeCache = require("node-cache");
const customers = require('./src/stripe');
const myCache = new NodeCache();

const HEB_URL = process.env.HEB_API || '';
const twilioAccount = process.env.TWILIO_ACCOUNT || '';
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || '';
const SMS_ENABLE = process.env.SMS_ENABLE || false;
if (SMS_ENABLE){
  const client = require("twilio")(twilioAccount, twilioAuthToken);
}

const SECOND_INTERVAL = 0.3;
const HTTP_OK = 200;

async function notify(arrayOfLocations) {
  // clear key no longer present
  const cacheKeys = myCache.keys();
  const locationKeys = arrayOfLocations.map(x => x.storeNumber);
  const difference = cacheKeys.filter(key => !locationKeys.includes(key));

  myCache.del(difference);
  // evaluate if location has new availability
  const availables = arrayOfLocations.filter((location) => {
    const value = myCache.get(location.storeNumber);
    myCache.set(location.storeNumber, { name: location.name, spots: location.openAppointmentSlots,});

    if (!value) { return true; }
    return (value.spots !== location.openAppointmentSlots)
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
      icon: path.join(__dirname, "HEB-logo.png"),
    };
    console.log(`🧬 💉 : ${available}`);

    notifier.notify(message);

    if (SMS_ENABLE) {
      console.log('Sending SMS')
      const list = await customers.getCustomers();
      const toSend = list.map(async (phone) => {
        if (phone) { await sendSMS(available, phone); }
      });
      await Promise.all(toSend);
    };
  }
}

async function sendSMS(locations, number) {
  try {
    await client.messages
    .create({
      body: `DO NOT REPLY\n VACCINE AVAILABLE\n${locations}\nLink: https://vaccine.heb.com/scheduler`,
      from: "+19362288796",
      to: number,
    });
  } catch (error) {
    console.log(`⛔️ Twilio Error: ${error}`);
  }
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
      (stores) => stores.city === "LAREDO" && stores.openAppointmentSlots > 1
    );

    if (listOfAvailability.length) {
      await notify(listOfAvailability);
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
