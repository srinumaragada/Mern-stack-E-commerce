const ProductList = require("../../models/Products");


const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    console.log("Received keyword:", keyword);
    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        succes: false,
        message: "Keyword is required and must be in string format",
      });
    }

    const regEx = new RegExp(keyword, "i");

    const createSearchQuery = {
      $or: [
        { title: regEx },
        { description: regEx },
        { category: regEx },
        { brand: regEx },
      ],
    };

    
    const searchResults = await ProductList.find(createSearchQuery);
    

    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
   
    res.status(500).json({
      success: false,
      message:error.message
    });
  }
};

module.exports = { searchProducts };