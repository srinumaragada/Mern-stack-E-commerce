const express=require("express")
const { getAllOrdersByAdmin, getOrderDetailsByAdmin, updateOrderStatus } = require("../../controllers/admin/orderControllers")

const router=express.Router()

router.get("/get",getAllOrdersByAdmin)
router.get("/get/:id",getOrderDetailsByAdmin)
router.put("/update/:id",updateOrderStatus)
module.exports=router