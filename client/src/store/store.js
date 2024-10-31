import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./AuthSlice/index.js"
import adminProductsReducer from './ProductSlice/index.js'
import shopProductsReducer from "./ShopSlice/index.js"
import cartProductReducer from './CartSlice/index.js'
import addressDetailsReducer from "./AddressSlice/index.js"
import PaymentDetailsReducer from "./OrderSlice/index.js"
import orderDetailsByAdminReducer from "./OrderSliceByAdmin/index.js"
import searchResultsReducer from "./SearchSlice/index.js"
import reviewResultReducer from "./ReviewSlice/index.js"
import featureImagesReducer from "./common-slice/index.js"
const store=configureStore({
    reducer:{
        auth:authReducer,
        adminProducts:adminProductsReducer,
        shopProducts:shopProductsReducer,
        cartProducts:cartProductReducer,
        addressDetails:addressDetailsReducer,
        paymentDetails:PaymentDetailsReducer,
        orderDetailsByAdmin:orderDetailsByAdminReducer,
        searchResultsList:searchResultsReducer,
        reviewResult:reviewResultReducer,
        featureImages:featureImagesReducer
    }

})
export default store