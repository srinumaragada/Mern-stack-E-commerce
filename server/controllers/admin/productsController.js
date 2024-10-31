const { uploadImageutil } = require("../../helpers/cloudinary");
const ProductList = require("../../models/Products");

const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Convert file buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;

    // Upload the image to Cloudinary (or another storage)
    const result = await uploadImageutil(url);

    // Send the result back to the client
    res.json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//add a new product
const addNewProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      price,
      brand,
      category,
      salePrice,
      totalStock,
    } = req.body;

    const newProduct = new ProductList({
      image,
      title,
      description,
      category,
      price,
      salePrice,
      totalStock,
      brand,
    });
    await newProduct.save();
    res.status(200).json({
      success: true,
      newProduct,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

//fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    const fetchProductDetails = await ProductList.find({});

    res.status(200).json({
      success: true,
      data: {
        fetchProductDetails,
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
// edit a product
const editProduct = async (req, res) => {
  try {
    console.log("Request params:", req.params);
    console.log("Request body:", req.body); // Check the incoming data
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    let findProduct = await ProductList.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice =
      salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;
    findProduct.averageReview = averageReview || findProduct.averageReview;

    await findProduct.save();
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
//delete a product

// Example deleteproduct function
const deleteproduct = async (req, res) => {
  try {
      const productId = req.params.id; // Assuming you're using a route param for ID
      
      // Attempt to delete the product
      const result = await ProductList.findByIdAndDelete(productId);

      if (!result) {
          // If the product was not found, send a 404 response
          return res.status(404).json({ success: false, message: "Product not found" });
      }

      // Send a success response
      return res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
      // Handle any errors
      console.error("Error deleting product:", error); // Log the error for debugging
      if (!res.headersSent) { // Check if headers are already sent
          return res.status(500).json({ success: false, message: "Internal server error" });
      }
  }
};

module.exports = {
  handleImageUpload,
  addNewProduct,
  fetchAllProducts,
  editProduct,
  deleteproduct,
};
