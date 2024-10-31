import CommonForm from "@/commonForm";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAddress, deleteAddress, fetchAllAddress, updateAddress } from "@/store/AddressSlice";
import AddressCard from "./addressCard";
import { toast, useToast } from "@/hooks/use-toast";

const initialAddressState = {
  address: "",
  phone: "",
  pincode: "",
  city: "",
  notes: "",
};
function Address({
  setCurrentAddressId,
  selectedId
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.addressDetails);
  const [formData, setFormData] = useState(initialAddressState);
  const [currentEditedState, setCurrentEditedState] = useState(null);
  const { toast } = useToast();

  function handleAddressDetails(event) {
    event.preventDefault();
    const addressCount = addressList?.allAddressess?.length || 0;
    if (addressCount >= 3) {
      toast({
        title: "Address Limit Reached",
        variant: "destructive",
        description: "You can add a maximum of 3 addresses. Please delete one to add a new address.",
      });
      setFormData(initialAddressState)
      return;
    }

    if (currentEditedState !== null) {
      // Update address if editing
      dispatch(updateAddress({ userId: user.id, addressId: currentEditedState, formData }))
        .then((data) => {
          if (data.payload.success) {
            dispatch(fetchAllAddress(user.id));
            setFormData(initialAddressState);
            setCurrentEditedState(null);
            toast({ title: "Address updated successfully" });
          }
        });
    } else {
      // Add new address if not editing
      dispatch(addAddress({ ...formData, userId: user.id }))
        .then((data) => {
          if (data.payload.success) {
            dispatch(fetchAllAddress(user.id));
            setFormData(initialAddressState);
            toast({ title: "Address added successfully" });
          }
        });
    }
  }

  function handleEditAddress(getEditedAddressId) {
    setCurrentEditedState(getEditedAddressId._id);
    setFormData({
      address: getEditedAddressId.address,
      phone: getEditedAddressId.phone,
      pincode: getEditedAddressId.pincode,
      city: getEditedAddressId.city,
      notes: getEditedAddressId.notes,
    });
  }

  function handleDeleteAddress(getDeleteAddressId) {
    dispatch(deleteAddress({ userId: user.id, addressId: getDeleteAddressId._id }))
      .then(() => {
        dispatch(fetchAllAddress(user.id));
      });
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((formItem) => formData[formItem].trim() !== "")
      .every((item) => item);
  }

  useEffect(() => {
    // Fetch addresses on component mount or when user changes
    if (user?.id) {
      dispatch(fetchAllAddress(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    console.log("Updated addressList:", addressList); // Log to verify address list updates
  }, [addressList]); // Watch for changes in addressList

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-4 sm:grid-cols-2 gap-2">
        {addressList && addressList.allAddressess && addressList.allAddressess.length > 0 ? (
          addressList.allAddressess.map((singleAddressItem) => (
            <AddressCard
            selectedId={selectedId}
            setCurrentAddressId={setCurrentAddressId}
              handleDeleteAddress={handleDeleteAddress}
              handleEditAddress={handleEditAddress}
              key={singleAddressItem._id}
              addressInfo={singleAddressItem}
            />
          ))
        ) : (
          <p>No addresses found. Add a new address above.</p>
        )}
      </div>
      <CardHeader>
        <CardTitle>{currentEditedState === null ? "Add new Address" : "Edit the Address"}</CardTitle>
      </CardHeader>
      <CardContent>
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedState === null ? "Add" : "Edit"}
          onSubmit={handleAddressDetails}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}

export default Address;
