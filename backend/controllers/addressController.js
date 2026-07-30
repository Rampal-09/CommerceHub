import { sendResponse, sendError } from "../utils/responseHandler.js";
import {
  createAddressService,
  getUserAddressesService,
  getAddressByIdService,
  updateAddressService,
  setDefaultAddressService,
  deleteAddressService,
} from "../services/addressService.js";

/**
 * @desc    Create a new address
 * @route   POST /api/address
 * @access  Private
 */
export const createAddress = async (req, res, next) => {
  try {
    const address = await createAddressService(req.user._id, req.body);
    return sendResponse(res, 201, "Address created successfully.", address);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Get all addresses of logged-in user
 * @route   GET /api/address
 * @access  Private
 */
export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await getUserAddressesService(req.user._id);
    return sendResponse(res, 200, "Addresses retrieved successfully.", addresses);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Get single address by ID
 * @route   GET /api/address/:id
 * @access  Private
 */
export const getAddressById = async (req, res, next) => {
  try {
    const address = await getAddressByIdService(req.user._id, req.params.id);
    return sendResponse(res, 200, "Address details retrieved successfully.", address);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Update an existing address
 * @route   PATCH /api/address/:id
 * @access  Private
 */
export const updateAddress = async (req, res, next) => {
  try {
    const updatedAddress = await updateAddressService(req.user._id, req.params.id, req.body);
    return sendResponse(res, 200, "Address updated successfully.", updatedAddress);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Set address as default
 * @route   PATCH /api/address/:id/default
 * @access  Private
 */
export const setDefaultAddress = async (req, res, next) => {
  try {
    const defaultAddress = await setDefaultAddressService(req.user._id, req.params.id);
    return sendResponse(res, 200, "Default address set successfully.", defaultAddress);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

/**
 * @desc    Delete an address
 * @route   DELETE /api/address/:id
 * @access  Private
 */
export const deleteAddress = async (req, res, next) => {
  try {
    await deleteAddressService(req.user._id, req.params.id);
    return sendResponse(res, 200, "Address deleted successfully.");
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.statusCode, error.message);
    }
    next(error);
  }
};

export default {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
};
