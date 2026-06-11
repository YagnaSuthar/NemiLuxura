import { v2 as cloudinary } from 'cloudinary';
import aboutContentModel from '../models/aboutContentModel.js';

// Get all about page images
const getAboutContent = async (req, res) => {
    try {
        const heroImage = await aboutContentModel.findOne({ section: 'heroImage' }).sort({ date: -1 });
        const teamImages = await aboutContentModel.find({ section: 'team' }).sort({ teamMemberIndex: 1, date: -1 });

        res.json({
            success: true,
            heroImage: heroImage ? { imageUrl: heroImage.imageUrl } : null,
            teamImages: teamImages.map(t => ({
                _id: t._id,
                imageUrl: t.imageUrl,
                teamMemberIndex: t.teamMemberIndex
            }))
        });
    } catch (error) {
        console.error('Error fetching about images:', error);
        res.json({ success: false, message: error.message });
    }
}

// Upsert hero image
const upsertAboutHeroImage = async (req, res) => {
    try {
        const imageFile = req.file;
        if (!imageFile) {
            return res.json({ success: false, message: 'No image file provided' });
        }

        console.log('Uploading about hero image to Cloudinary...');
        const result = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: 'image',
        });

        console.log('Cloudinary upload successful:', {
            secure_url: result.secure_url,
            public_id: result.public_id
        });

        // Delete existing hero image
        await aboutContentModel.deleteMany({ section: 'heroImage' });

        const heroImage = new aboutContentModel({
            section: 'heroImage',
            imageUrl: result.secure_url,
            date: Date.now()
        });
        await heroImage.save();

        res.json({ success: true, message: 'Hero image updated successfully', image: heroImage });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Upsert team member image
const upsertTeamImage = async (req, res) => {
    try {
        const { teamMemberIndex, itemId } = req.body;
        const imageFile = req.file;

        if (!imageFile) {
            return res.json({ success: false, message: 'No image file provided' });
        }

        if (teamMemberIndex === undefined || teamMemberIndex === null) {
            return res.json({ success: false, message: 'Team member index is required' });
        }

        console.log('Uploading team member image to Cloudinary...');
        const result = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: 'image',
        });

        console.log('Cloudinary upload successful:', {
            secure_url: result.secure_url,
            public_id: result.public_id
        });

        let item;
        if (itemId) {
            // Update existing team image
            item = await aboutContentModel.findByIdAndUpdate(
                itemId,
                {
                    imageUrl: result.secure_url,
                    teamMemberIndex: parseInt(teamMemberIndex),
                    date: Date.now()
                },
                { new: true }
            );
            if (!item) {
                return res.json({ success: false, message: 'Team image not found' });
            }
        } else {
            // Delete existing image for this team member index if any
            await aboutContentModel.deleteMany({ section: 'team', teamMemberIndex: parseInt(teamMemberIndex) });
            
            // Create new team image
            item = new aboutContentModel({
                section: 'team',
                imageUrl: result.secure_url,
                teamMemberIndex: parseInt(teamMemberIndex),
                date: Date.now()
            });
            await item.save();
        }

        res.json({ success: true, message: 'Team image saved successfully', item });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Delete content item
const deleteAboutItem = async (req, res) => {
    try {
        const { itemId } = req.body;

        if (!itemId) {
            return res.json({ success: false, message: 'Item ID is required' });
        }

        const deletedItem = await aboutContentModel.findByIdAndDelete(itemId);
        if (!deletedItem) {
            return res.json({ success: false, message: 'Item not found' });
        }

        res.json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { getAboutContent, upsertAboutHeroImage, upsertTeamImage, deleteAboutItem };

