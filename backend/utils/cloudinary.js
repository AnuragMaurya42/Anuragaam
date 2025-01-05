import {v1 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config({}); // to access the .env file

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET

});
export default cloudinary;