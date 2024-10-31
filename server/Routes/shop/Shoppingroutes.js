const express=require("express")
const { fetchAllShoppingDetails, getProductDetails } = require("../../controllers/shop/ShoppingdetailsController")

const router=express.Router()

router.get("/get",fetchAllShoppingDetails)
router.get("/get/:id",getProductDetails)
module.exports=router