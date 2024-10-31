
import ShoppingProductDetails from "@/components/shopping-view/ProductDetails";
import ShoppingProductTile from "@/components/shopping-view/productTile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartDetails } from "@/store/CartSlice";
import { getSearchResults, resetSearchResults } from "@/store/SearchSlice";
import { getAllProductDetails } from "@/store/ShopSlice";



import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function SearchList() {
  const [keyword, setKeyword] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.searchResultsList);
  const { productDetails } = useSelector((state) => state.shopProducts);

  const { user } = useSelector((state) => state.auth);

  const { cartItems } = useSelector((state) => state.cartProducts);
  const { toast } = useToast();
  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 2) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 1000);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword]);

  function handleAddtoCart(getProductId,getTotalStock) {
    console.log("User object:", user); 
  
    // Use user.id instead of user._id
    if (!user || !user.id) {
      console.error("User not logged in or UserId missing");
      return;
    }
  
    const getCartItems=cartItems.items||[]
    if(getCartItems.length){
      const indexOfCurrentItem=getCartItems.findIndex(item=>item.ProductId === getProductId)
      if(indexOfCurrentItem > -1){
       const getQuantity=getCartItems[indexOfCurrentItem].quantity
       if(getQuantity +1 > getTotalStock ){
        toast({
          title:`Only ${getQuantity} quantity can be added for this item`,
          variant:"destructive"
        })
        return
       }
      }
    }
    

    const cartPayload = { UserId: user.id, ProductId: getProductId, quantity: 1 };
  
    dispatch(addToCart(cartPayload))
      .unwrap()
      .then((data) => {
        if(data.success){
          dispatch(fetchCartDetails(user.id))
          toast({
            title:"Item added to cart"
          })
        }
      })
      .catch((error) => {
        console.error("Failed to add product to cart", error);
      });
  }
  
  
  function handleGetProductDetails(getCurrentProductDetailId) {
    dispatch(getAllProductDetails(getCurrentProductDetailId));
    setOpenDialog(true); 
  }
  

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="py-6"
            placeholder="Search Products..."
          />
        </div>
      </div>
      {!searchResults.length ? (
        <h1 className="text-5xl font-extrabold">No result found!</h1>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResults.map((item) => (
          <ShoppingProductTile
            handleAddtoCart={handleAddtoCart}
            product={item}
            handleGetProductDetails={handleGetProductDetails}
          />
        ))}
      </div>
      <ShoppingProductDetails
        open={openDialog}
        setOpen={setOpenDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchList;