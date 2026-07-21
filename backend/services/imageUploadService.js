import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

/**
 * Upload single image to Cloudinary
 * @param {Buffer} fileBuffer
 * @param {string} folder
 * @returns {Promise<{url: string, public_id: string}>}
 */
export const uploadSingleImage = async (fileBuffer, folder = "products") => {
  if (!fileBuffer) return null;
  return await uploadToCloudinary(fileBuffer, folder);
};

/**
 * Upload multiple images to Cloudinary concurrently
 * @param {Array<Object>} filesArray - Array of Multer file objects
 * @param {string} folder
 * @param {number} maxCount
 * @returns {Promise<{uploadedImages: Array<{url: string, public_id: string}>, publicIds: Array<string>}>}
 */
export const uploadMultipleImages = async (filesArray = [], folder = "products", maxCount = 5) => {
  const uploadedImages = [];
  const publicIds = [];

  const filesToUpload = filesArray.slice(0, maxCount);

  for (const file of filesToUpload) {
    const uploaded = await uploadToCloudinary(file.buffer, folder);
    uploadedImages.push({
      url: uploaded.url,
      public_id: uploaded.public_id,
    });
    publicIds.push(uploaded.public_id);
  }

  return { uploadedImages, publicIds };
};

/**
 * Delete a single image from Cloudinary by public ID
 * @param {string} publicId
 */
export const deleteSingleImage = async (publicId) => {
  if (!publicId) return;
  await deleteFromCloudinary(publicId).catch((err) =>
    console.error(`Failed to delete Cloudinary image (${publicId}):`, err)
  );
};

/**
 * Delete multiple images from Cloudinary by public IDs
 * @param {Array<string>} publicIdsArray
 */
export const deleteMultipleImages = async (publicIdsArray = []) => {
  if (!Array.isArray(publicIdsArray) || publicIdsArray.length === 0) return;

  for (const publicId of publicIdsArray) {
    if (publicId) {
      await deleteFromCloudinary(publicId).catch((err) =>
        console.error(`Failed to delete Cloudinary image (${publicId}):`, err)
      );
    }
  }
};

/**
 * Rollback newly uploaded files on transaction failure
 * @param {Array<string>} publicIdsArray
 */
export const rollbackUploadedFiles = async (publicIdsArray = []) => {
  if (!Array.isArray(publicIdsArray) || publicIdsArray.length === 0) return;
  console.log("Rolling back newly uploaded Cloudinary files due to error...");
  await deleteMultipleImages(publicIdsArray);
};
