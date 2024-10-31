import { Home, LogOut, Menu, ShoppingCart, UserRound } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import { shoppingViewHeaderMenuItems } from '@/config';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '@/store/AuthSlice';
import UserCartWrapper from './cart-wrapper';
import { fetchCartDetails } from '@/store/CartSlice';
import { Label } from '../ui/label';
import { fetchAllProducts } from '@/store/ProductSlice';


function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const handleNavigate = async (menuItem) => {
    // Clear existing filters
    sessionStorage.removeItem("filters");

    if (menuItem.id !== "home" && menuItem.id !== "products" && menuItem.id !== "search") {
      const filters = { category: [menuItem.id] };
      sessionStorage.setItem("filters", JSON.stringify(filters));
      
      if (location.pathname.includes("listing")) {
        // Update search params and fetch filtered products
        setSearchParams({ category: menuItem.id });
        await dispatch(fetchAllProducts({ category: menuItem.id }));
      } else {
        navigate(menuItem.path);
        await dispatch(fetchAllProducts({ category: menuItem.id }));
      }
    } else {
      // For home, products, and search, fetch all products
      navigate(menuItem.path);
      await dispatch(fetchAllProducts({}));
    }
  };

  return (
    <nav className="flex flex-col lg:flex-row lg:items-center gap-6 font-semibold">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          key={menuItem.id}
          className=" font-bold text-md text-black justify-start lg:justify-center"
          onClick={() => handleNavigate(menuItem)}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

// Header Right Content (Shopping Cart and User Menu)
function HeaderRightContent() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [openSheet, setOpenSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector(state => state.cartProducts) || { cartItems: { items: [] } }; // Default fallback

  // Handle LogOut
  function handleLogOut() {
    dispatch(logOut());
  }

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchCartDetails(user.id));
    }
  }, [dispatch, isAuthenticated, user]);

  return (
    <div className="flex items-center gap-4"> 
      <Sheet open={openSheet} onOpenChange={() => setOpenSheet(false)}>
        <Button
          onClick={() => setOpenSheet(true)}
          className="w-full bg-white text-black border hover:bg-gray-100"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className='absolute top-2 font-bold ml-10'>{cartItems.items?.length || 0}</span>
          <span className="sr-only">Use Cart</span>
        </Button>
        <UserCartWrapper setOpenSheet={setOpenSheet} cartItems={cartItems?.items && cartItems.items.length > 0 ? cartItems.items : []} />
      </Sheet>
      {isAuthenticated && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="rounded-full bg-black">
              <AvatarFallback className="bg-black text-white font-bold">
                {user?.userName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-56">
            <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/shop/account")}>
              <UserRound className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}


// Main Header Component
function ShoppingHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 justify-between items-center px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <Home className="h-6 w-6" />
          <span className="font-bold text-lg">ECommerce</span>
        </Link>

        {/* Mobile Menu (for small screens) */}
        <Sheet>
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Header Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-xs pt-20 flex flex-col items-start">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>

        {/* Desktop Menu (visible on larger screens) */}
        <div className="hidden lg:flex flex-grow justify-center">
          <MenuItems />
        </div>
        <div className="hidden lg:flex items-center gap-6">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
