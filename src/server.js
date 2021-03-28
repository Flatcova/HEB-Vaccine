const express = require('express')
const app = express()
require('dotenv').config()
const Stripe = require('stripe')(process.env.STRIPE_PK)
const bodyParser = require('body-parser')
const cors = require('cors')
const _ = require('lodash');

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(cors())

app.post("/payment", cors(), async (req, res) => {
    let {amount, id, name, email, phone} = req.body

    try {

        const customer = await Stripe.customers.create({
            name: name,
            phone: phone,
            email: email,
        },{
            idempotencyKey: phone
          })

        const payment = await Stripe.paymentIntents.create({
            amount: 600,
            currency: 'USD',
            description: 'HEB-Vaccine Notifier',
            payment_method: id,
            confirm: true,
            customer: customer.id,
            metadata: {
                amount,
                name,
                email,
                phone
            }
        },{
            idempotencyKey: phone
          })

        console.log(`costumer:\n ${JSON.stringify(customer)}`);

        res.json({
            message: "Payment was successful",
            success: true,
            status: 200
        })

    } catch (error) {
        console.log(`Error:\n ${error}`);
        if (_.includes(`${error}`, 'idempotent')){
            res.json({
                message: "This phone it's already in our data",
                success: false,
                status: 401
            })
        }else{
            res.json({
                message: "There was something wrong with the Payment",
                success: false,
                status: 401
            })
        }
        
    }
})

app.listen(process.env.PORT || 4000, () => {
    console.log("Server Running on port 4000");
})