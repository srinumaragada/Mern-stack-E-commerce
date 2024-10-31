const express=require("express")
const { searchProducts } = require("../../controllers/shop/searchControllers")


const router=express.Router()

router.get("/:keyword",searchProducts)

module.exports=router