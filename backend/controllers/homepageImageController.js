import { v2 as cloudinary } from 'cloudinary';
import homepageImageModel from '../models/homepageImageModel.js';

// Get all homepage images (hero and featured)
const getHomepageImages = async (req, res) => {
    try {
        // Sort hero images by date descending (newest first), then by order
        const heroImages = await homepageImageModel.find({ type: 'hero' }).sort({ date: -1, order: 1 });
        const featuredImage = await homepageImageModel.findOne({ type: 'featured' }).sort({ date: -1 });
        
        console.log('Fetching homepage images:', {
            heroCount: heroImages.length,
            hasFeatured: !!featuredImage,
            heroUrls: heroImages.map(img => img.imageUrl)
        });
        
        res.json({
            success: true,
            heroImages: heroImages.map(img => ({
                _id: img._id,
                imageUrl: img.imageUrl, // Cloudinary URL
                order: img.order
            })),
            featuredImage: featuredImage ? {
                _id: featuredImage._id,
                imageUrl: featuredImage.imageUrl // Cloudinary URL
            } : null
        });
    } catch (error) {
        console.error('Error fetching homepage images:', error);
        res.json({ success: false, message: error.message });
    }
}

// Add a homepage image (hero or featured)
const addHomepageImage = async (req, res) => {
    try {
        const { type, order } = req.body;
        
        if (!type || (type !== 'hero' && type !== 'featured')) {
            return res.json({ success: false, message: 'Invalid type. Must be "hero" or "featured"' });
        }

        const imageFile = req.file;
        if (!imageFile) {
            return res.json({ success: false, message: 'No image file provided' });
        }

        // Upload to Cloudinary
        console.log('Uploading image to Cloudinary...');
        const result = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: 'image',
        });

        console.log('Cloudinary upload successful:', {
            secure_url: result.secure_url,
            public_id: result.public_id,
            format: result.format
        });

        const imageData = {
            type,
            imageUrl: result.secure_url, // Store Cloudinary secure URL
            order: type === 'hero' ? (order ? parseInt(order) : 0) : 0,
            date: Date.now()
        };

        // If it's a featured image, remove previous featured images
        if (type === 'featured') {
            await homepageImageModel.deleteMany({ type: 'featured' });
        }

        const newImage = new homepageImageModel(imageData);
        await newImage.save();

        res.json({ success: true, message: 'Image added successfully', image: newImage });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update a homepage image (change image)
const updateHomepageImage = async (req, res) => {
    try {
        const { imageId } = req.body;
        const imageFile = req.file;

        if (!imageId) {
            return res.json({ success: false, message: 'Image ID is required' });
        }

        if (!imageFile) {
            return res.json({ success: false, message: 'No image file provided' });
        }

        const existingImage = await homepageImageModel.findById(imageId);
        if (!existingImage) {
            return res.json({ success: false, message: 'Image not found' });
        }

        // Upload new image to Cloudinary
        console.log('Updating image in Cloudinary...');
        const result = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: 'image',
        });

        console.log('Cloudinary update successful:', {
            secure_url: result.secure_url,
            imageId: imageId
        });

        // Update the image URL with new Cloudinary URL
        existingImage.imageUrl = result.secure_url; // Update with new Cloudinary secure URL
        existingImage.date = Date.now();
        await existingImage.save();

        res.json({ success: true, message: 'Image updated successfully', image: existingImage });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Delete a homepage image
const deleteHomepageImage = async (req, res) => {
    try {
        const { imageId } = req.body;

        if (!imageId) {
            return res.json({ success: false, message: 'Image ID is required' });
        }

        const deletedImage = await homepageImageModel.findByIdAndDelete(imageId);
        if (!deletedImage) {
            return res.json({ success: false, message: 'Image not found' });
        }

        res.json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { getHomepageImages, addHomepageImage, updateHomepageImage, deleteHomepageImage };

