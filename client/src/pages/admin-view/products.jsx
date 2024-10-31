import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import React, { Fragment, useEffect, useState } from "react";
import ProductImageUpload from "./image-upload";
import { useDispatch, useSelector } from "react-redux";
import { addNewProduct, deleteproduct, editProducts, fetchAllProducts } from "@/store/ProductSlice";
import { useToast } from "@/hooks/use-toast";
import AdminProductTile from "../../components/admin-view/productTile";
import CommonForm from "@/commonForm";

const initialState = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [productsformData, setproductsFormData] = useState(initialState);
  const [imageFile, setImageFile] = useState(null);
  const [uploadImageUrl, setuploadImageurl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.adminProducts);
  const { toast } = useToast();
  const [currentEditedState,setcurrentEditedState]=useState(null)



  function onSubmit(event) {
    event.preventDefault();
    
  console.log("Products Form Data before dispatch: ", productsformData);
  const productData = currentEditedState !== null 
  ? { ...productsformData, image: uploadImageUrl } 
  : { ...productsformData, image: uploadImageUrl };
  if (currentEditedState !== null) {
    dispatch(
      editProducts({
        id: currentEditedState,
        productsformdata: productData,  // Make sure you're passing the correct object here
      })
    ).then((data) => {
      console.log("Edit Response: ", data);
      if (data?.payload?.success) {
        dispatch(fetchAllProducts())
        setproductsFormData(initialState)
        setOpenCreateProductsDialog(false)
        setcurrentEditedState(null)
        toast({ title: "Product updated successfully" });
      }
    });
  }else{
    dispatch(
      addNewProduct(productData)
    ).then((data) => {
      if (data?.payload?.success) {
        setImageFile(null);
        setproductsFormData(initialState);
        setOpenCreateProductsDialog(false);
        dispatch(fetchAllProducts());
        toast({
          title: "Product added successfully",
        });
      }
    });
  }
  }


function FormValid(){
    return Object.keys(productsformData).map(key=>productsformData[key] !=="").every(item=>item)
}

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);
  console.log(currentEditedState)

function handleDelete(deletedData){
  console.log(deletedData);
  dispatch(deleteproduct(deletedData)).then((data)=>{
    if(data.payload.success)
    dispatch(fetchAllProducts())
  })
  
}
  return (
    <Fragment>
      <div className="flex w-full justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add Products
        </Button>
      </div>

      {/* Render the product tiles */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-5">
        {productList && productList.length > 0 ? (
          productList.map((prodItem) => (
            <AdminProductTile deleteHandling={handleDelete}setproductsFormData={setproductsFormData} openCreateProductsDialog={openCreateProductsDialog} setOpenCreateProductsDialog={setOpenCreateProductsDialog} currentEditedState={currentEditedState} setcurrentEditedState={setcurrentEditedState} key={prodItem._id} product={prodItem} />
          ))
        ) : (
          "No Products Are There"
        )}
      </div>

      {/* Sheet for adding products */}
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false)
          setcurrentEditedState(null)
          setproductsFormData(initialState)
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>{
              currentEditedState!==null ?"Edit Product":"Add New Product"
              }</SheetTitle>
            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadImageUrl={uploadImageUrl}
              setuploadImageurl={setuploadImageurl}
              imageLoadingState={imageLoadingState}
              setImageLoadingState={setImageLoadingState}
            />
          </SheetHeader>
          <div className="py-6">
            <CommonForm
              isBtnDisabled={!FormValid()}
              formControls={addProductFormElements}
              formData={productsformData}
              setFormData={setproductsFormData}
              buttonText={currentEditedState!==null ?"Edit":"Add"}
              onSubmit={onSubmit}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
