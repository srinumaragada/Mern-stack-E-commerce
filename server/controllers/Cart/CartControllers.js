const Cart = require("../../models/cart");
const ProductList = require("../../models/Products");

const addCartDetails = async (req, res) => {
  try {
    const { UserId, ProductId, quantity } = req.body;

    
    if (!UserId || !ProductId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data.",
      });
    }

    const product = await ProductList.findById(ProductId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    
    let cart = await Cart.findOne({ UserId });
    if (!cart) {
      cart = new Cart({ UserId, items: [] });
    }


    const existingProductIndex = cart.items.findIndex(
      (item) => item.ProductId.toString() === ProductId
    );

    if (existingProductIndex === -1) {
      cart.items.push({ ProductId, quantity });
    } else {
      cart.items[existingProductIndex].quantity += quantity;
    }

  
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

const fetchCartDetails = async (req, res) => {
  try {
    const { UserId } = req.params;
    if (!UserId) {
      return res.status(404).json({
        success: false,
        message: "You are not a valid user",
      });
    }
    const cart = await Cart.findOne({ UserId }).populate({
      path: "items.ProductId",
      select: "image title price salePrice",
    });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "You do not have a product with this Id",
      });
    }

    const validateItems = cart.items.filter(
      (productitem) => productitem.ProductId
    );
    if (validateItems.length < cart.items.length) {
      cart.items = validateItems;
      await cart.save();
    }
    const populateItems = validateItems.map((item) => ({
      ProductId: item.ProductId._id,
      image: item.ProductId.image,
      title: item.ProductId.title,
      price: item.ProductId.price,
      salePrice: item.ProductId.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateItems,
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
const UpdateCartDetails = async (req, res) => {
  try {
    const { UserId, ProductId, quantity } = req.body;
    
    console.log("Update request:", { UserId, ProductId, quantity }); // Log incoming data

    if (!UserId || !ProductId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ UserId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "You do not have a cart.",
      });
    }

    const findIndexofCurrentProduct = cart.items.findIndex(
      (item) => item.ProductId.toString() === ProductId
    );

    if (findIndexofCurrentProduct === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present!",
      });
    }
    
    // Update the quantity
    console.log("Previous quantity:", cart.items[findIndexofCurrentProduct].quantity); // Log previous quantity
    cart.items[findIndexofCurrentProduct].quantity = quantity;
    await cart.save();

    // Populating updated cart items
    await cart.populate({
      path: "items.ProductId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      ProductId: item.ProductId ? item.ProductId._id : null,
      image: item.ProductId ? item.ProductId.image : null,
      title: item.ProductId ? item.ProductId.title : "Product not found",
      price: item.ProductId ? item.ProductId.price : null,
      salePrice: item.ProductId ? item.ProductId.salePrice : null,
      quantity: item.quantity,
    }));

    console.log("Updated cart items:", populateCartItems); // Log updated items

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.error("Error updating cart:", error); // Log error
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCartDetails = async (req, res) => {
  try {
    const { UserId, ProductId } = req.params;
    if (!UserId || !ProductId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ UserId }).populate({
      path: "items.ProductId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }
    cart.items = cart.items.filter(
      (item) => item.ProductId._id.toString() !== ProductId
    );

    await cart.save();

    await cart.populate({
      path: "items.ProductId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      ProductId: item.ProductId ? item.ProductId._id : null,
      image: item.ProductId ? item.ProductId.image : null,
      title: item.ProductId ? item.ProductId.title : "Product not found",
      price: item.ProductId ? item.ProductId.price : null,
      salePrice: item.ProductId ? item.ProductId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addCartDetails,
  fetchCartDetails,
  UpdateCartDetails,
  deleteCartDetails,
};
