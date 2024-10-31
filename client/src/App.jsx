import { Navigate, Route, Routes } from "react-router-dom"
import AuthLayout from "./components/auth/layout"
import Login from "./pages/auth/login"
import Register from "./pages/auth/register"
import AdminViewlayout from "./components/admin-view/layout"
import AdminDashboard from "./pages/admin-view/dashboard"
import AdminFeatures from "./pages/admin-view/features"
import AdminOrders from "./pages/admin-view/orders"
import AdminProducts from "./pages/admin-view/products"
import ShoppingLayout from "./components/shopping-view/layout"
import ShoppingAccount from "./pages/shopping-view/account"
import ShoppingHome from "./pages/shopping-view/home"
import Checkout from "./pages/shopping-view/checkout"
import Shoplisting from "./pages/shopping-view/listing"
import NotFound from "./pages/NotFound"
import CheckAuth from "./components/common/check-auth"
import UnAuthPage from "./unAuthPage"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { CheckAuthAction } from "./store/AuthSlice/index"
import { Skeleton } from "@/components/ui/skeleton"
import PaypalReturn from "./pages/shopping-view/paypalReturn"
import PaymentSuccess from "./pages/shopping-view/payment-success"
import SearchList from "./pages/shopping-view/search"


function App() {
const {isAuthenticated,user,isLoading}=useSelector((state)=>state.auth)
const disPatch=useDispatch()
useEffect(()=>{
    disPatch(CheckAuthAction())
},[disPatch])
if(isLoading)return <Skeleton className="w-[100px] h-[20px] "/>
console.log("the value is",isLoading,user);

  return (
    <Routes >
      <Route path="/"  element={ <Navigate to={!isAuthenticated ? "/auth/login": user?.role === "admin"? "/admin/dashboard" : "/shop/home" }replace /> }/>
      <Route path="/auth" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><AuthLayout/></CheckAuth>}>
      <Route path="login" element={<Login/>}/>
      <Route path="register" element={<Register/>}/>
      </Route>
      <Route path="/admin" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><AdminViewlayout/></CheckAuth>}>
        <Route path="dashboard" element={<AdminDashboard/>}/>
        <Route path="features" element={<AdminFeatures/>}/>
        <Route path="orders" element={<AdminOrders/>}/>
        <Route path="products" element={<AdminProducts/>}/>
      </Route>
      <Route path="/shop" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><ShoppingLayout/></CheckAuth>}>
        <Route path="account" element={<ShoppingAccount/>}/>
        <Route  path="home" element={<ShoppingHome/>}/>
        <Route  path="checkout" element={<Checkout/>}/>
        <Route  path="listing" element={<Shoplisting/>}/>
        <Route path="paypal-return" element={<PaypalReturn/>}/>
        <Route path="payment-success" element={<PaymentSuccess/>}/>
        <Route path="search" element={<SearchList/>}/>
      </Route>
      <Route path="*" element={<NotFound/>}/>
      <Route path="/unauth-page" element={<UnAuthPage/>}/>
    </Routes>
  )
}
export default App
