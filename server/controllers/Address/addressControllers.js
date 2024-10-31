const Address = require("../../models/address");

const addAddress = async (req, res) => {
  try {
    const { userId, address, phone, notes, pincode, city } = req.body;
    if (!userId || !address || !phone || !notes || !pincode || !city) {
      res.status(404).json({
        success: false,
        message: "No proper details",
      });
    }

    const newAddress = new Address({
      userId,
      address,
      phone,
      notes,
      pincode,
      city,
    });

    await newAddress.save();
    res.status(200).json({
      success: true,
      data: {
        newAddress,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res.status(404).json({
        success: false,
        message: "No proper userId",
      });
    }
    const allAddressess = await Address.find({ userId });
    res.status(200).json({
      success: true,
      data: {
        allAddressess,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;
    if (!userId || !addressId) {
      res.status(404).json({
        success: false,
        message: "No proper details",
      });
    }
    const updatedAddress = await Address.findOneAndUpdate(
      { userId, _id:addressId },
      formData,
      { new: true }
    );
    res.status(200).json({
      success: true,
      data: {
        updatedAddress,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    if (!userId || !addressId) {
      res.status(404).json({
        success: false,
        message: "No proper details",
      });
    }

    const deleteItem = await Address.findOneAndDelete({ userId, _id:addressId });
    if (!deleteItem) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }
    res.status(200).json({
      success: true,
      message:"Data deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addAddress,
  fetchAllAddress,
  updateAddress,
  deleteAddress,
};
