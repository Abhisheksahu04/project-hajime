import { v2 as cloudinary } from "cloudinary";
import { extractPublicId } from "cloudinary-build-url";
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    //uplood file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // console.log(response);
    // console.log("file is uploded on cloudinary", response.url);

    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);

    return null;
  }
};

const deleteImgFromCloudinary = async (url) => {
  try {
    
    const publicId = extractPublicId(url);
    await cloudinary.uploader.destroy(publicId, { resource_type: "image"});

  } catch (error) {
    throw new Error(error.message);
  }

}

export { uploadOnCloudinary, deleteImgFromCloudinary };
