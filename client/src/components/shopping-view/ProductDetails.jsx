import { AvatarFallback } from "@radix-ui/react-avatar";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartDetails } from "@/store/CartSlice";
import { useToast } from "@/hooks/use-toast";
import { Label } from "../ui/label";
import StarReview from "../common/star-Review";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/ReviewSlice";

function ShoppingProductDetails({ open, setOpen, productDetails }) {
  if (!productDetails) {
    return null; 
  }
  const [rating,setRating]=useState(0)
  const[reviewmsg,setReviewMsg]=useState('')
  const dispatch = useDispatch();
  const { cartItems } = useSelector(state => state.cartProducts);
  const { toast } = useToast();
  const { user } = useSelector(state => state.auth);
  const {reviewList}=useSelector(state=>state.reviewResult)



  



  function handleRating(getRating){
        setRating(getRating)
  }
  function handleAddToCart(getProductId, getTotalStock) {
    if (!user) {
      return toast({
        title: "No user found",
        variant: "destructive"
      });
    }

    const getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(item => item.ProductId === getProductId);
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive"
          });
          return;
        }
      }
    }

    dispatch(addToCart({ UserId: user.id, ProductId: getProductId, quantity: 1 }))
      .then(() => {
        dispatch(fetchCartDetails(user.id));
        setOpen(false); 
        setRating(0),
        setReviewMsg("")
        toast({
          title: "Item added successfully"
        });
      });
  }
function handleAddReview(){
    dispatch(addReview({
        productId:productDetails._id,
        userId:user.id,
        userName:user.userName,
        reviewMessage:reviewmsg,
        reviewValue:rating
    })).then((data)=>{
        if(data.payload.success){
            dispatch(getReviews(productDetails._id))
            setRating(0)
            setReviewMsg("")
            toast({
                title:"Review Added Successfully"
            })
        }
    }
    )
}
useEffect(()=>{
        if(productDetails!==null){
            dispatch(getReviews(productDetails._id))
        }
},[productDetails])



const averageReview =reviewList&& reviewList.length>0?
  reviewList.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
  reviewList.length:0

console.log(reviewList,"ReviewList");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[60vw]">
        <div className="relative overflow-hidden rounded-lg">
          <img width={400} height={300} className="aspect-square w-full object-cover" src={productDetails.image} alt={productDetails.title} />
        </div>
        <div>
          <h1 className="font-extrabold">{productDetails.title}</h1>
          <p className="font-semibold text-2xl text-muted-foreground mb-3">{productDetails.description}</p>
          <div className="flex items-center justify-between">
            <p className={`text-3xl font-bold text-primary ${productDetails?.salePrice > 0 ? "line-through" : ""}`}>${productDetails.price}</p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center mt-3 gap-0.5">
                <StarReview  rating={averageReview} size={4}/>
            </div>
            <span className="ml-2 mt-2 text-lg">({averageReview.toFixed(1)})</span>
          </div>
          {productDetails.totalStock === 0 ? (
            <Button className="w-full mt-4 mb-1 opacity-60 cursor-not-allowed">Out of Stock</Button>
          ) : (
            <Button onClick={() => handleAddToCart(productDetails._id, productDetails.totalStock)} className="w-full mt-4 mb-1">Add to cart</Button>
          )}
          <div>
            <Separator />
          </div>
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-2xl font-extrabold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {
                reviewList&&reviewList.length >0 ?reviewList.map(item=>
                    <div className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback className="ml-2 mt-1 text-lg font-extrabold">{item.userName.slice(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex gap-2">
                        <h3 className="text-center font-bold">{item.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarReview rating={item.reviewValue } size={4}/>
                      </div>
                      <p className="">{item.reviewMessage}</p>
                    </div>
                  </div>
                ):<h1>No Reviews</h1>
              }
              
            </div>
            <div className="flex flex-col mt-16 gap-2">
                <Label className="font-bold text-lg">Write a Review</Label>
                <div>
                <StarReview  handleRating={handleRating} rating={rating}/>
                </div>
              <Input value={reviewmsg} name={reviewmsg} onChange={(event)=>setReviewMsg(event.target.value)} placeholder="Write a review ...." />
              <Button onClick={handleAddReview} disabled={reviewmsg.trim() === ""}>Submit</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShoppingProductDetails;
