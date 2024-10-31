import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({ addressInfo, handleDeleteAddress, handleEditAddress, setCurrentAddressId, selectedId }) {
  if (!addressInfo) return null; // Ensure addressInfo exists
  
  // Check if this address is selected
  const isSelected = selectedId && selectedId._id === addressInfo._id;
console.log(isSelected,selectedId);

  return (
    <Card onClick={setCurrentAddressId ? () => setCurrentAddressId(addressInfo) : null} className={isSelected ? "border-primary border-black" : ""}>
      <CardContent className="grid p-4 gap-4">
        <Label>Address: {addressInfo.address || "N/A"}</Label>
        <Label>City: {addressInfo.city || "N/A"}</Label>
        <Label>Pincode: {addressInfo.pincode || "N/A"}</Label>
        <Label>Phone: {addressInfo.phone || "N/A"}</Label>
        <Label>Notes: {addressInfo.notes || "N/A"}</Label>
      </CardContent>
      <CardFooter className="p-3 flex justify-between">
        <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
        <Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
