import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import React, { useEffect, useRef } from "react";

function ProductImageUpload({
  imageFile,
  setImageFile,
  setuploadImageurl,
  imageLoadingstate,
  setImageLoadingState
}) {
  const inputRef = useRef(null);

  // Handle file selection from input
  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setImageFile(selectedFile);
    }
  }

  // Handle drag-over event for drag-and-drop feature
  function handleDragOver(event) {
    event.preventDefault();
  }

  // Handle file drop event for drag-and-drop
  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setImageFile(droppedFile);
    }
  }

  // Remove the image and reset input
  function handleremoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  // Upload image to Cloudinary via the backend
  async function uploadImageToCloudinary() {
    try {
        setImageLoadingState(true)
      const data = new FormData();
      data.append("my_file", imageFile);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/products/uploadImage`,
        data
      );

      console.log(response);
      
      if (response.data && response.data.success) {
        setuploadImageurl(response.data.result.url); // Set the uploaded image URL
        setImageLoadingState(false)
    }
    } catch (error) {
      console.log("Error uploading the image:", error);
    }
  }

  // Upload the image when imageFile changes
  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div className="w-full max-w-md mx-auto">
      <Label className="text-lg font-semibold mt-2 mb-2 block">
        Upload Image
      </Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-dashed border-2 rounded-lg p-4 mt-4"
      >
        <Input
          id="image-upload"
          type="file"
          ref={inputRef}
          onChange={handleImageFileChange}
          className="hidden"
        />
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center h-32 cursor-pointer"
          >
            <UploadCloudIcon className="w-10 h-10 mb-2 text-muted-foreground" />
            <span>Drag and Drop or Click to upload image</span>
          </Label>
        ) : (
          imageLoadingstate?<Skeleton className="h-10 bg-gray-500"/>:
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <FileIcon className="w-7 h-8 mr-2 text-primary" />
            </div>
            <p className="text-sm font-medium">{imageFile.name}</p>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground bg-transparent"
              onClick={handleremoveImage}
            >
              <XIcon className="w-8 h-8" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
