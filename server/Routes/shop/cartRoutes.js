const express=require("express")
const { addCartDetails, fetchCartDetails, UpdateCartDetails, deleteCartDetails } = require("../../controllers/Cart/CartControllers")

const router=express.Router()

router.post("/add",addCartDetails)
router.get("/get/:UserId",fetchCartDetails)
router.put("/update-cart",UpdateCartDetails)
router.delete("/:UserId/:ProductId",deleteCartDetails)

module.exports = router;
