const express=require("express")
const { createorder, capturePayment, getAllOrdersByUser, getOrderDetails } = require("../../controllers/Orders/OrderControllers")


const router=express.Router()

router.post("/create",createorder)
router.post("/capture",capturePayment)
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);

module.exports=router