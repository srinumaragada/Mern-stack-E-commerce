const mongoose=require("mongoose")


const ProductsSchema= new mongoose.Schema({
        image:String,
        title:String,
        description:String,
        category:String,
        price:Number,
        salePrice:Number,
        totalStock:Number,
        brand:String
},{timestamps:true})

const ProductList=mongoose.model("ProductList",ProductsSchema)

module.exports= ProductList