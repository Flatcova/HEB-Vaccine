const Stripe = require('stripe');
const STRIPE_PK = process.env.STRIPE_PK || '';
const stripe = Stripe(STRIPE_PK);

async function getCustomers() {
  const customers = await stripe.customers.list();
  if (customers.data) {
    const listOfCustomer = customers.data.map(customer => customer.phone);
    return listOfCustomer;
  }
}

exports.getCustomers = getCustomers;
