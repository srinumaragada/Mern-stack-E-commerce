import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByAdmin, getOrderDetailsByAdmin, resetOrderDetails } from "@/store/OrderSliceByAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "../ui/badge";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import AdminOrderDetailsView from "./orderDetails";

function AdminOrdersView() {
  const dispatch = useDispatch();
  const { orderList, orderDetails } = useSelector((state) => state.orderDetailsByAdmin);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const handleFetchOrderDetails = (getOrderId) => {
    dispatch(getOrderDetailsByAdmin(getOrderId));
  };

  useEffect(() => {
    dispatch(getAllOrdersByAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails) {
      setOpenDetailsDialog(true);
    }
  }, [orderDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList?.getOrders?.length > 0
              ? orderList.getOrders.map((orderItem) => (
                  <TableRow key={orderItem._id}>
                    <TableCell>{orderItem._id}</TableCell>
                    <TableCell>{orderItem.orderDate.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${
                          orderItem.orderStatus === "confirmed"
                            ? "bg-green-500"
                            : orderItem.orderStatus === "rejected"
                            ? "bg-red-600"
                            : "bg-black"
                        }`}
                      >
                        {orderItem.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>${orderItem.totalAmount}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {

                          handleFetchOrderDetails(orderItem._id); // Fetch order details
                          setOpenDetailsDialog(true); // Open dialog
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>

      {/* Dialog for order details */}
      <Dialog open={openDetailsDialog} onOpenChange={() => {
          setOpenDetailsDialog(false);
          dispatch(resetOrderDetails());
        }}
      >
        <AdminOrderDetailsView  orderDetails={orderDetails} />
      </Dialog>
    </Card>
  );
}

export default AdminOrdersView;
