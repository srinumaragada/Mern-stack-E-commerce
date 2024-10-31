import React, { useState, useEffect } from "react";
import acct from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import UserCartItemContent from "@/components/shopping-view/cart-wrapperContent";
import { Button } from "@/components/ui/button";
import { CreateOrder } from "@/store/OrderSlice";
import { toast, useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";

function Checkout() {
  const { cartItems } = useSelector((state) => state.cartProducts);
  const { user } = useSelector((state) => state.auth);
  const [currentAddressId, setCurrentAddressId] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const { approvalURL } = useSelector((state) => state.paymentDetails);
  
  const totalAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem.salePrice > 0
              ? currentItem.salePrice
              : currentItem.price) *
              currentItem.quantity,
          0
        )
      : 0;

  function handlePaymentWithPaypal() {
    if (!cartItems || cartItems.items.length === 0) {
      console.log("Cart is empty. Triggering toast.");
      toast({
        title: "Your cart is empty. Please add items to proceed.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentAddressId === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user.id,
      cartId: cartItems._id,
      cartItems:
        cartItems &&
        cartItems.items.length > 0 &&
        cartItems.items.map((singleItem) => ({
          productId: singleItem.ProductId,
          title: singleItem.title,
          image: singleItem.image,
          price: singleItem.salePrice > 0 ? singleItem.salePrice : singleItem.price,
          quantity: singleItem.quantity,
        })),
      addressInfo: {
        addressId: currentAddressId._id,
        address: currentAddressId.address,
        city: currentAddressId.city,
        phone: currentAddressId.phone,
        pincode: currentAddressId.pincode,
        notes: currentAddressId.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(CreateOrder(orderData)).then((data) => {
      if (data.payload.success) {
        setIsPaymentStart(true);
      } else {
        setIsPaymentStart(false);
      }
    });
  }

  useEffect(() => {
    // Redirect to approval URL if it exists
    if (approvalURL) {
      window.location.href = approvalURL;
    }
  }, [approvalURL]);

 
  return (
    <div className="flex flex-col">
      <div className="relative h-[400px] w-full overflow-hidden">
        <img src={acct} alt="Account" />
      </div>
      <div className="grid grid-col-1 sm:grid-cols-2 mt-5 p-5 gap-4">
        <Address selectedId={currentAddressId} setCurrentAddressId={setCurrentAddressId} />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((items) => (
                <UserCartItemContent key={items._id} cartItems={items} />
              ))
            : ""}
          <div className=" space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalAmount.toFixed(2)}</span>
            </div>
            <div className=" mt-4 pt-4">
              <Button onClick={handlePaymentWithPaypal} className="w-full">
                {isPaymentStart ? "Processing payment with paypal....":"CheckOut With Paypal"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
