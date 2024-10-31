const ProductList = require("../../models/Products");

// Fetch all products with filtering and sorting
const fetchAllShoppingDetails = async (req, res) => {
  try {
    const { category = "", brand = "", sortby = "price-lowtohigh" } = req.query;

    let filter = {};
    let sort = {};

    if (category) {
      filter.category = { $in: category.split(",") };
    }
    if (brand) {
      filter.brand = { $in: brand.split(",") };
    }

    switch (sortby) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
        break;
    }

    const fetchShoppingProducts = await ProductList.find(filter).sort(sort);

    res.status(200).json({
      success: true,
      data: fetchShoppingProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Fetch product details by ID
const getProductDetails = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required."
      });
    }

    const productDetails = await ProductList.findById(productId);

    if (!productDetails) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      data: productDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { fetchAllShoppingDetails, getProductDetails };
