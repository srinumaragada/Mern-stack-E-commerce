import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from '@/store/OrderSlice';
import React, { useEffect, useState } from 'react';
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "../ui/dialog"; // Assuming DialogTrigger and DialogContent are separate components in your dialog setup
import ShoppingOrderDetailsView from "./orderDetails";

function Orders() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { orderList, orderDetails } = useSelector(state => state.paymentDetails);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    function handleFetchOrderDetails(orderId) {
        setSelectedOrderId(orderId);
        dispatch(getOrderDetails(orderId));
        setOpenDetailsDialog(true);
    }

    useEffect(() => {
        if (user?.id) {
            dispatch(getAllOrdersByUserId(user.id));
        }
    }, [dispatch, user]);

    console.log(orderDetails);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead>Order Price</TableHead>
                            <TableHead><span className="sr-only">Details</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orderList && orderList.length > 0 ?
                            orderList.map(item => (
                                <TableRow key={item._id}>
                                    <TableCell>{item._id}</TableCell>
                                    <TableCell>{item.orderDate.split("T")[0]}</TableCell>
                                    <TableCell>
                                        <Badge className={`py-1 px-3 ${item?.orderStatus === "confirmed"
                                                ? "bg-green-500"
                                                : item?.orderStatus === "rejected"
                                                    ? "bg-red-600"
                                                    : "bg-black"
                                            }`}>
                                            {item.orderStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>${item.totalAmount}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleFetchOrderDetails(item._id)}>
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan="5">No orders found.</TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </CardContent>

            {openDetailsDialog && (
                <Dialog open={openDetailsDialog} onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setOpenDetailsDialog(false);
                        setSelectedOrderId(null);
                        dispatch(resetOrderDetails());
                    }
                }}>
                    <DialogContent >
                        <DialogClose asChild>
                            <Button onClick={() => setOpenDetailsDialog(false)}>Close</Button>
                        </DialogClose>
                        <ShoppingOrderDetailsView orderDetails={orderDetails} />
                    </DialogContent>
                </Dialog>
            )}
        </Card>
    );
}

export default Orders;
