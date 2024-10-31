const express=require("express")
const { getReviews, addReview } = require("../../controllers/shop/ReviewControllers")



const router=express.Router()
router.post("/add",addReview)
router.get("/:productId",getReviews)

module.exports=router