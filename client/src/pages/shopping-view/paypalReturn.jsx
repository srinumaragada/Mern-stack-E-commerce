import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { captureOrder } from "@/store/OrderSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function PaypalReturn() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const payerId = params.get("PayerID");
  const paymentId = params.get("paymentId");

  useEffect(() => {
    if (payerId && paymentId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
      console.log(orderId);

      dispatch(captureOrder({ payerId, paymentId, orderId })).then((data) => {
        if (data.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success"; // Fixed the redirect
        } else {
          // Handle failure case, possibly redirect to an error page or show a message
          console.error("Payment capture failed:", data.payload.message);
          window.location.href = "/shop/payment-failed"; // Example error page
        }
      });
    }
  }, [dispatch, paymentId, payerId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing.....! Please wait for a while...</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturn;
