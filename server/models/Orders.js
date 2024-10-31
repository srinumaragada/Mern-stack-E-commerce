const mongoose = require("mongoose")


const OrderSchema = mongoose.Schema({
    userId:String,
    cartId:String,
    cartItems:[
        {
            productId:String,
            title:String,
            image:String,
            price:String,
            salePrice:String,
            quantity:Number
        }
    ],
    addressInfo:[
        {
            addressId:String,
            address:String,
            city:String,
            phone:String,
            pincode:String,
            notes:String
        }
    ],
    orderStatus:String,
    paymentMethod:String,
    paymentStatus:String,
    totalAmount:String,
    orderDate:Date,
    orderUpdateDate:Date,
    paymentId:String,
    payerId:String
},{
    timesStamps:true
})

const Orders= mongoose.model("Orders",OrderSchema)
module.exports=Orders