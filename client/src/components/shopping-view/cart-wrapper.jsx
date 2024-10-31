import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemContent from "./cart-wrapperContent";

function UserCartWrapper({cartItems,setOpenSheet}) {
    const navigate=useNavigate()
    function handleNavigate(){
        navigate("/shop/checkout")
        setOpenSheet(false)
    }
    const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;
    return ( 
        <SheetContent className="sm:max-w-md">
            <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
            </SheetHeader>
            <div>
                {cartItems&&cartItems.length>0 ?
                cartItems.map((item)=><UserCartItemContent key={item.ProductId} cartItems={item}/>):""}
            </div>
            <div className="mt-8 space-y-4">
                <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">${totalCartAmount.toFixed(2)}</span>
                </div>
            </div>
            <Button onClick={(handleNavigate)}className="w-full mt-6">CheckOut</Button>
        </SheetContent>       
     );
}

export default UserCartWrapper;