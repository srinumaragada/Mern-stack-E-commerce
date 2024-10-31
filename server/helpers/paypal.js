const paypal=require("paypal-rest-sdk")

paypal.configure({
    mode:"sandbox",
    client_id:process.env.PAYPAl_CLIENT_ID,
    client_secret:process.env.PAYPAL_CLIENT_SECRET
})
module.exports=paypal