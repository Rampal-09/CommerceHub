import Address from "../modals/addressSchema.js";

/**
 * Add a new address for logged-in user
 */
export const createAddressService = async (userId, data) => {
  const existingCount = await Address.countDocuments({ user: userId });

  // Rule: First address automatically becomes default
  if (existingCount === 0) {
    data.isDefault = true;
  } else if (data.isDefault === true) {
    // If setting as default, remove default flag from user's other addresses
    await Address.updateMany({ user: userId, isDefault: true }, { isDefault: false });
  }

  const newAddress = new Address({
    ...data,
    user: userId,
  });

  await newAddress.save();
  return newAddress;
};

/**
 * Get all addresses of logged-in user
 */
export const getUserAddressesService = async (userId) => {
  const addresses = await Address.find({ user: userId }).sort({
    isDefault: -1,
    createdAt: -1,
  });
  return addresses;
};

/**
 * Get single address by ID with ownership check
 */
export const getAddressByIdService = async (userId, addressId) => {
  const address = await Address.findOne({ _id: addressId, user: userId });
  if (!address) {
    throw { statusCode: 404, message: "Address not found" };
  }
  return address;
};

/**
 * Update an existing address with ownership check
 */
export const updateAddressService = async (userId, addressId, updateData) => {
  const address = await Address.findOne({ _id: addressId, user: userId });
  if (!address) {
    throw { statusCode: 404, message: "Address not found" };
  }

  // If set as default, remove default from previous default address
  if (updateData.isDefault === true) {
    await Address.updateMany(
      { user: userId, _id: { $ne: addressId }, isDefault: true },
      { isDefault: false }
    );
  }

  // Prevent un-defaulting if it's the only address
  if (updateData.isDefault === false && address.isDefault) {
    const totalCount = await Address.countDocuments({ user: userId });
    if (totalCount === 1) {
      updateData.isDefault = true; // Must remain default if it's the only address
    }
  }

  Object.assign(address, updateData);
  await address.save();

  return address;
};

/**
 * Set a specific address as default
 */
export const setDefaultAddressService = async (userId, addressId) => {
  const address = await Address.findOne({ _id: addressId, user: userId });
  if (!address) {
    throw { statusCode: 404, message: "Address not found" };
  }

  if (address.isDefault) {
    return address;
  }

  // Remove default flag from all existing user addresses
  await Address.updateMany({ user: userId, isDefault: true }, { isDefault: false });

  // Set selected address as default
  address.isDefault = true;
  await address.save();

  return address;
};

/**
 * Delete an address with automatic default reallocation if needed
 */
export const deleteAddressService = async (userId, addressId) => {
  const address = await Address.findOne({ _id: addressId, user: userId });
  if (!address) {
    throw { statusCode: 404, message: "Address not found" };
  }

  const wasDefault = address.isDefault;

  await Address.deleteOne({ _id: addressId, user: userId });

  // If deleted address was default, make oldest remaining address default
  if (wasDefault) {
    const oldestRemaining = await Address.findOne({ user: userId }).sort({ createdAt: 1 });
    if (oldestRemaining) {
      oldestRemaining.isDefault = true;
      await oldestRemaining.save();
    }
  }

  return { message: "Address deleted successfully" };
};

export default {
  createAddressService,
  getUserAddressesService,
  getAddressByIdService,
  updateAddressService,
  setDefaultAddressService,
  deleteAddressService,
};
