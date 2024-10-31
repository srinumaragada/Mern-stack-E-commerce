const mongoose=require("mongoose")


const AddressSchema=mongoose.Schema({
    userId:String,
    address:String,
    phone:String,
    city:String,
    pincode:String,
    notes:String
},{
    timeStamps:true
})

const Address=mongoose.model("Address",AddressSchema)

module.exports=Address