const Orders = require("../../models/Orders");
const ProductList = require("../../models/Products");
const Review = require("../../models/Review");

const addReview = async (req, res) => {
try {
    const { productId, userId, userName,reviewMessage, reviewValue } = req.body;

    const order = await Orders.find({ userId, "cartItems.productId": productId,orderStatus: "confirmed" || "delivered" });
  
    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase product to review it.",
      });
    }
  
    const  checkexistedReview = await Review.findOne({productId,userId})
  
    if (checkexistedReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product!",
      });
    }
  
    const newReview= new Review({
      productId, userId, reviewMessage, reviewValue,userName
    })
    await newReview.save()
  
    const reviews = await Review.find({ productId });
    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewsLength;
  
    await ProductList.findByIdAndUpdate(productId, { averageReview });
  
    res.status(201).json({
      success: true,
      data: newReview,
    });
} catch (error) {
    res.status(500).json({
        success: false,
        message: error.message,
      });
}
};


const getReviews = async(req,res)=>{
    try {
        const { productId } = req.params;
    
        const reviews = await Review.find({ productId });
        res.status(200).json({
          success: true,
          data: reviews,
        });
      } catch (error) {
        
        res.status(500).json({
          success: false,
          message: error.message        });
      }
    }
    
module.exports= {addReview,getReviews}

