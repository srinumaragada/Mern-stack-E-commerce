const Orders = require("../../models/Orders")




const getAllOrdersByAdmin=async(req,res)=>{

   try {
    const getOrders=await Orders.find({})

    if(!getOrders.length){
        return res.status(404).json({
            success:false,
            message:"No OrdersList"
        })
    }

        res.status(200).json({
            success:true,
            data:{
                getOrders
}})
   } catch (error) {
            res.status(500).json({
                success:false,
                message:error.message
            })
   }
}


const getOrderDetailsByAdmin=async(req,res)=>{
   try {
    const {id}=req.params

    const orderDetails=await Orders.findById(id)
        if(!orderDetails){
            return res.status(404).json({
                success: false,
                message: "Order not found!",
              });
        }

        res.status(200).json({
            success:true,
                orderDetails
        })
   } catch (error) {
    res.status(500).json({
        success:false,
        message:error.message
    })
   }
}

const updateOrderStatus=async(req,res)=>{
   try {
    const {id}=req.params
    const {orderStatus}=req.body
    const order = await Orders.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    const orderStatusDetails=await Orders.findByIdAndUpdate(id,{orderStatus})

    res.status(200).json({
        success: true,
        message: "Order status is updated successfully!",
        orderStatusDetails
      });
   } catch (error) {
    res.status(500).json({
        success:false,
        message:error.message
    })
   }
}
module.exports={getAllOrdersByAdmin,getOrderDetailsByAdmin,updateOrderStatus}