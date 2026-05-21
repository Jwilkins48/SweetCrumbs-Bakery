import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    // store images in folder
    folder: "sweetcrumbs",
    // only allow images
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

// multer upload middleware
export const upload = multer({ storage });

export default cloudinary;
