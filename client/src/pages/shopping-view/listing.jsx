import ShoppingFilter from "@/components/shopping-view/filter";
import ShoppingProductDetails from "@/components/shopping-view/ProductDetails";
import ShoppingProductTile from "@/components/shopping-view/productTile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartDetails } from "@/store/CartSlice";
import { fetchShoppingProducts, getAllProductDetails } from "@/store/ShopSlice";

import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

// Define this function outside of Shoplisting component
function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.length > 0 ? queryParams.join("&") : ""; // Return empty string if no params
}

function Shoplisting() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const { cartItems } = useSelector((state) => state.cartProducts);

  const categorySearch = searchParams.get("category");

  // Effect to set filters from session storage and update `searchParams`
  useEffect(() => {
    const savedFilters = JSON.parse(sessionStorage.getItem("filters")) || {};
    setFilters(savedFilters);
    setSearchTerm(searchParams.get("search") || ""); // Get search term from URL

    const filterParamsString = createSearchParamsHelper(savedFilters);
    setSearchParams(filterParamsString); // Set URL params based on saved filters
  }, [categorySearch, searchParams, setSearchParams]);

  // Effect to fetch products when filters or sorting change
  useEffect(() => {
    const params = {
      filterParams: filters,
      sortParams: sort,
      searchTerm, // Include search term in the parameters
    };
    dispatch(fetchShoppingProducts(params));
  }, [dispatch, filters, sort, searchTerm]);

  function handleGetProductDetails(getCurrentProductDetailId) {
    dispatch(getAllProductDetails(getCurrentProductDetailId));
    setOpenDialog(true);
  }

  function handleFilter(getSectionId, getOptionId) {
    let updatedFilters = { ...filters };
    const currentFilter = updatedFilters[getSectionId] || [];

    if (currentFilter.includes(getOptionId)) {
      updatedFilters[getSectionId] = currentFilter.filter((option) => option !== getOptionId);
    } else {
      updatedFilters[getSectionId] = [...currentFilter, getOptionId];
    }

    setFilters(updatedFilters);
    sessionStorage.setItem("filters", JSON.stringify(updatedFilters));

    const filterParamsString = createSearchParamsHelper(updatedFilters);
    setSearchParams(filterParamsString); // Update URL params when filters change
  }

  function handleSort(value) {
    setSort(value);
  }

  function handleAddtoCart(getProductId, getTotalStock) {
    if (!user || !user.id) {
      console.error("User not logged in or UserId missing");
      return;
    }

    const getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex((item) => item.ProductId === getProductId);
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    const cartPayload = { UserId: user.id, ProductId: getProductId, quantity: 1 };

    dispatch(addToCart(cartPayload))
      .unwrap()
      .then((data) => {
        if (data.success) {
          dispatch(fetchCartDetails(user.id));
          toast({
            title: "Item added to cart",
          });
        }
      })
      .catch((error) => {
        console.error("Failed to add product to cart", error);
      });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 p-4 md:p-6">
      <ShoppingFilter filters={filters} handleFilter={handleFilter} />
      <div className="w-full bg-background rounded-lg shadow-sm">
        <div className="p-3 border-b flex items-center justify-between">
          <div className="text-lg font-bold">All Products</div>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-muted-foreground font-semibold">
              {productList.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white text-black flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="w-5 h-5" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((options) => (
                    <DropdownMenuRadioItem value={options.id} key={options.id}>
                      {options.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid lg:grid-cols-4 lg:gap-4 grid-cols-2">
          {productList && productList.length > 0
            ? productList.map((Productitem) => (
                <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  key={Productitem._id}
                  product={Productitem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            : "No Products"}
        </div>
      </div>
      <ShoppingProductDetails
        open={openDialog}
        setOpen={setOpenDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default Shoplisting;
