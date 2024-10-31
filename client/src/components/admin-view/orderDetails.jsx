import CommonForm from "@/commonForm";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { DialogContent } from "../ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { getAllOrdersByAdmin, getOrderDetailsByAdmin, updateOrderStatus } from "@/store/OrderSliceByAdmin";

const initialFormData = {
    status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
    const { user } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState(initialFormData);
    const dispatch=useDispatch()

    
    const addressInfo = orderDetails?.addressInfo?.[0] || {}; 
    const cartItems = orderDetails?.cartItems || []; 

    function handleUpdateStatus(event){
        event.preventDefault()
        console.log(formData);
        const {status}=formData
        dispatch(updateOrderStatus({id:orderDetails?._id,orderStatus:status})).then((data)=>{
            if(data.payload.success){
                dispatch(getOrderDetailsByAdmin(orderDetails?._id))
                dispatch(getAllOrdersByAdmin())
                setFormData(initialFormData)
            }
        })
        
    }
    return (
        <DialogContent className="sm:max-w-[600px]">
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <div className="flex mt-6 items-center justify-between">
                        <p className="font-medium">Order ID</p>
                        <Label>{orderDetails?._id || "N/A"}</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Order Date</p>
                        <Label>{new Date(orderDetails?.orderDate).toLocaleString() || "N/A"}</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Order Price</p>
                        <Label>${orderDetails?.totalAmount || "N/A"}</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Payment Method</p>
                        <Label>{orderDetails?.paymentMethod || "N/A"}</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Payment Status</p>
                        <Label>{orderDetails?.paymentStatus || "N/A"}</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Order Status</p>
                        <Label>
                            <Badge
                                className={`py-1 px-3 ${
                                    orderDetails?.orderStatus === "confirmed"
                                        ? "bg-green-500"
                                        : orderDetails?.orderStatus === "rejected"
                                            ? "bg-red-600"
                                            : "bg-black"
                                }`}
                            >
                                {orderDetails?.orderStatus || "N/A"}
                            </Badge>
                        </Label>
                    </div>
                </div>

                <Separator />

                <div className="grid gap-4">
                    <div className="font-medium">Order Details</div>
                    <ul className="grid gap-3">
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <li className="flex items-center justify-between" key={item._id}>
                                    <span>Title: {item.title || "N/A"}</span>
                                    <span>Quantity: {item.quantity || "N/A"}</span>
                                    <span>Price: ${item.price || "N/A"}</span>
                                </li>
                            ))
                        ) : (
                            <p>No items in cart</p>
                        )}
                    </ul>
                </div>

                <Separator />

                <div className="grid gap-4">
                    <div className="font-medium">Shipping Info</div>
                    <div className="grid gap-0.5 text-muted-foreground">
                        <span>{user?.userName || "N/A"}</span>
                        {addressInfo ? (
                            <>
                                <span>{addressInfo.address || "N/A"}</span>
                                <span>{addressInfo.city || "N/A"}</span>
                                <span>{addressInfo.pincode || "N/A"}</span>
                                <span>{addressInfo.phone || "N/A"}</span>
                                <span>{addressInfo.notes || "N/A"}</span>
                            </>
                        ) : (
                            <p>No address info available</p>
                        )}
                    </div>
                </div>

                <Separator />

                <CommonForm
          formControls={[
            {
              label: "Order Status",
              name: "status",
              componentType: "select",
              options: [
                { id: "pending", label: "Pending" },
                { id: "inProcess", label: "In Process" },
                { id: "inShipping", label: "In Shipping" },
                { id: "delivered", label: "Delivered" },
                { id: "rejected", label: "Rejected" },
              ],
            },
          ]}
          formData={formData}
          setFormData={setFormData}
          buttonText={"Update Order Status"}
          onSubmit={handleUpdateStatus}
        />
            </div>
        </DialogContent>
    );
}

export default AdminOrderDetailsView;
