import React, { useEffect, useState } from "react";
import banner1 from "../../assets/banner-1.webp";
import banner2 from "../../assets/banner-2.webp";
import banner3 from "../../assets/banner-3.webp";
import { Button } from "@/components/ui/button";
import { BabyIcon, ChevronLeftIcon, ChevronRightIcon, CloudLightning, Footprints, WatchIcon } from "lucide-react";
import { PiShirtFoldedBold } from "react-icons/pi";
import { Card, CardContent } from "@/components/ui/card";
import NikeIcon from "../../icons/icons8-nike.svg";
import AdidasIcon from "../../icons/icons8-adidas.svg";
import HmIcon from "../../icons/hm.svg";
import PumaIcon from "../../icons/puma.svg";
import LevisIcon from "../../icons/levis.svg";
import ZaraIcon from "../../icons/zara.svg";
import { useDispatch, useSelector } from "react-redux";
import { fetchShoppingProducts, getAllProductDetails } from "@/store/ShopSlice";
import ShoppingProductTile from "@/components/shopping-view/productTile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartDetails } from "@/store/CartSlice";
import { useToast } from "@/hooks/use-toast";
import ShoppingProductDetails from "@/components/shopping-view/ProductDetails";
import { getFeatureImages } from "@/store/common-slice";

function ShoppingHome() {
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const [currentSlide, setCurrentSlide] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false); 
  const { featureImageList } = useSelector((state) => state.featureImages);

  const categoryByIcon = [
    { id: "men", label: "Men", icon: PiShirtFoldedBold },
    { id: "women", label: "Women", icon: CloudLightning },
    { id: "kids", label: "Kids", icon: BabyIcon },
    { id: "accessories", label: "Accessories", icon: WatchIcon },
    { id: "footwear", label: "Footwear", icon: Footprints },
  ];

  const brandByIcon = [
    { id: "nike", label: "Nike", icon: NikeIcon },
    { id: "adidas", label: "Adidas", icon: AdidasIcon },
    { id: "puma", label: "Puma", icon: PumaIcon },
    { id: "levi", label: "Levi's", icon: LevisIcon },
    { id: "zara", label: "Zara", icon: ZaraIcon },
    { id: "h&m", label: "H&M", icon: HmIcon },
  ];

  const handleNavigatetoListing = (getCartItem, getSection) => {
    sessionStorage.removeItem("filters");
    const currentItem = { [getSection]: [getCartItem.id] };
    navigate("/shop/listing");
    sessionStorage.setItem("filters", JSON.stringify(currentItem));
  };

  const handleGetProductDetails = (getProductId) => {
    dispatch(getAllProductDetails(getProductId)).then(() => setOpenDialog(true));
  };

  const handleAddToCart = (getProductId) => {
    if (!user || !user.id) {
      console.error("User not logged in or UserId missing");
      return;
    }
    const cartPayload = { UserId: user.id, ProductId: getProductId, quantity: 1 };
    dispatch(addToCart(cartPayload))
      .unwrap()
      .then((data) => {
        if (data.success) {
          dispatch(fetchCartDetails(user.id));
          toast({ title: "Item added to cart" });
        }
      })
      .catch((error) => {
        console.error("Failed to add product to cart", error);
      });
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length), 5000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(fetchShoppingProducts({ filterParams: {}, sortParams: "price-lowtohigh" }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

console.log(featureImageList);

  return (
    <div id="root">
      {/* Banner Section */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList&& featureImageList.length>0?featureImageList.map((slide, index) => (
          <img
            key={index}
            className={`${index === currentSlide ? "opacity-100" : "opacity-0"} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
            src={slide.image}
            alt={`Slide ${index + 1}`}
          />
        )):<h1>No Bnners</h1>}
        <Button
          onClick={() => setCurrentSlide((prevSlide) => (prevSlide - 1 + featureImageList.length) % featureImageList.length)}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </Button>
        <Button
          onClick={() => setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length)}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </Button>
      </div>

      {/* Shop by Category Section */}
      <section className="flex items-center justify-center py-12 bg-gray-50">
        <div className="container text-center">
          <h1 className="font-extrabold text-3xl text-black mb-6">Shop by category</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoryByIcon.map((categoryItem) => (
              <Card
                onClick={() => handleNavigatetoListing(categoryItem, "category")}
                key={categoryItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 text-primary" />
                  <span className="mt-2 text-lg">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Brands Section */}
      <section className="flex items-center justify-center py-6 bg-gray-50">
        <div className="container text-center">
          <h1 className="font-extrabold text-3xl text-black mb-6">Shop by brands</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandByIcon.map((brandItem) => (
              <Card
                onClick={() => handleNavigatetoListing(brandItem, "brand")}
                key={brandItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <img src={brandItem.icon} alt={`${brandItem.label} Logo`} className="w-12 h-12" />
                  <span className="mt-2 text-lg">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem.id}
                    handleGetProductDetails={handleGetProductDetails}
                    handleAddToCart={handleAddToCart}
                    product={productItem}
                  />
                ))
              : ""}
          </div>
        </div>
      </section>

      {/* Product Details Dialog */}
      <ShoppingProductDetails open={openDialog} setOpen={setOpenDialog} productDetails={productDetails} />
    </div>
  );
}

export default ShoppingHome;
