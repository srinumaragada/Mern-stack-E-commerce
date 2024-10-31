const express = require("express");
const { upload } = require("../../helpers/cloudinary");
const { handleImageUpload, addNewProduct, editProduct, deleteproduct, fetchAllProducts } = require("../../controllers/admin/productsController");
const router = express.Router();

// Multer middleware to handle file upload
router.post("/uploadImage", upload.single("my_file"), handleImageUpload);
router.post("/add",addNewProduct)
router.put("/edit/:id",editProduct)
router.delete("/delete/:id",deleteproduct)
router.get("/get",fetchAllProducts)

module.exports = router;
