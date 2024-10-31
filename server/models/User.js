const mongoose =require("mongoose")

const UserSchema= mongoose.Schema({
    userName:{
        type:String,
        unique:true,
        required:[true,"UserName is required field"]
    },
    email:{
        type:String,
        required:[true,"Email is required field"],
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:[4,"Password must contain atleast 4 characters"]
    },
    role:{
        type:String,
        default:"user"
    }
})
const User=mongoose.model("User",UserSchema)

module.exports=User