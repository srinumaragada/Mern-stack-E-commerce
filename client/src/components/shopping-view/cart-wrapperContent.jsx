import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartItem,
  UpdateCartDetails,
} from "@/store/CartSlice";
import { useToast } from "@/hooks/use-toast";

function UserCartItemContent({ cartItems }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { productList } = useSelector((state) => state.shopProducts); // Ensure you're selecting the product list
  const { toast } = useToast();

  function handleDelete(cartItem) {
    dispatch(
      deleteCartItem({ UserId: user.id, ProductId: cartItem.ProductId })
    ).then((data) => {
      if (data.payload.success) {
        toast({
          title: "Item deleted successfully",
        });
      }
    });
  }

  function handleUpdateItems(cartItem, typeOfAction) {
  if (!Array.isArray(productList) || productList.length === 0) {
    toast({
      title: "Product list is not available.",
      variant: "destructive",
    });
    return;
  }

  const updatedCartItem = { ...cartItem };
  const productIndex = productList.findIndex(product => product._id === cartItem.ProductId);
  
  // Logging to inspect the product index and stock
  console.log("Product Index:", productIndex);
  console.log("Product List:", productList);

  const totalStock = productIndex > -1 ? productList[productIndex].totalStock : "N/A";

  if (totalStock === "N/A") {
    toast({
      title: "This product is not available in stock.",
      variant: "destructive",
    });
    return;
  }

  // Ensure totalStock is a number for correct comparison
  if (typeof totalStock !== 'number') {
    console.error("Total stock is not a number for product:", productList[productIndex]);
    return;
  }

  if (typeOfAction === "plus") {
    if (updatedCartItem.quantity < totalStock) {
      updatedCartItem.quantity += 1;
    } else {
      toast({
        title: `You can only add up to ${totalStock} of this item.`,
        variant: "destructive",
      });
      return;
    }
  } else if (typeOfAction === "minus") {
    if (updatedCartItem.quantity > 1) {
      updatedCartItem.quantity -= 1;
    } else {
      toast({
        title: "Quantity cannot be less than 1.",
        variant: "destructive",
      });
      return;
    }
  }

  dispatch(
    UpdateCartDetails({
      UserId: user.id,
      ProductId: updatedCartItem.ProductId,
      quantity: updatedCartItem.quantity,
    })
  ).then((data) => {
    if (data.payload.success) {
      toast({
        title: "Item updated successfully",
      });
    } else {
      toast({
        title: "Failed to update item quantity.",
        variant: "destructive",
      });
    }
  });
}


  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItems.image}
        alt={cartItems.title}
        className="w-20 h-20 rounded object-cover mb-2"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItems.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            onClick={() => handleUpdateItems(cartItems, "minus")}
            disabled={cartItems.quantity === 1}
            variant="outline"
            className="bg-white text-black rounded-full w-6 h-6 p-1 mr-2"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="font-semibold">{cartItems.quantity}</span>
          <Button
            onClick={() => handleUpdateItems(cartItems, "plus")}
            variant="outline"
            className="bg-white text-black rounded-full w-6 h-6 p-1 mr-2"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          ${(cartItems.salePrice > 0 ? cartItems.salePrice : cartItems.price) * cartItems.quantity}
        </p>
        <Trash
          onClick={() => handleDelete(cartItems)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
}

export default UserCartItemContent;
