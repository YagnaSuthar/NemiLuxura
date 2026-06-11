import { v2 as cloudinary } from 'cloudinary';
import firmContentModel from '../models/firmContentModel.js';

// Get all Firm page content (public)
const getFirmContent = async (req, res) => {
    try {
        const items = await firmContentModel.find().sort({ section: 1, order: 1, date: -1 });

        const foamHero = items.find(i => i.section === 'foamHero') || null;
        const mattressHero = items.find(i => i.section === 'mattressHero') || null;
        const pillowHero = items.find(i => i.section === 'pillowHero') || null;

        const foams = items
            .filter(i => i.section === 'foamItem')
            .map(i => ({
                _id: i._id,
                name: i.title,
                stock: i.stock || ''
            }));

        const mattresses = items
            .filter(i => i.section === 'mattressItem')
            .map(i => ({
                _id: i._id,
                name: i.title,
                description: i.description || ''
            }));

        res.json({
            success: true,
            foamHero: foamHero ? { _id: foamHero._id, imageUrl: foamHero.imageUrl } : null,
            mattressHero: mattressHero ? { _id: mattressHero._id, imageUrl: mattressHero.imageUrl } : null,
            pillowHero: pillowHero ? { _id: pillowHero._id, imageUrl: pillowHero.imageUrl } : null,
            foams,
            mattresses
        });
    } catch (error) {
        console.error('Error fetching firm content:', error);
        res.json({ success: false, message: error.message });
    }
};

// Admin: upload/update hero image for a section
const upsertFirmHeroImage = async (req, res) => {
    try {
        const { section } = req.body; // foamHero, mattressHero, pillowHero
        const imageFile = req.file;

        if (!section || !['foamHero', 'mattressHero', 'pillowHero'].includes(section)) {
            return res.json({ success: false, message: 'Invalid section' });
        }

        if (!imageFile) {
            return res.json({ success: false, message: 'No image file provided' });
        }

        const result = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: 'image',
        });

        const imageUrl = result.secure_url;

        const existing = await firmContentModel.findOne({ section });
        if (existing) {
            existing.imageUrl = imageUrl;
            existing.date = Date.now();
            await existing.save();
            return res.json({ success: true, message: 'Hero image updated', item: existing });
        }

        const doc = new firmContentModel({
            section,
            imageUrl,
            order: 0
        });
        await doc.save();

        res.json({ success: true, message: 'Hero image created', item: doc });
    } catch (error) {
        console.error('Error saving firm hero image:', error);
        res.json({ success: false, message: error.message });
    }
};

// Admin: add or edit list item (foamItem, mattressItem)
const upsertFirmItem = async (req, res) => {
    try {
        const { id, section, title, description, stock, order } = req.body;

        if (!section || !['foamItem', 'mattressItem'].includes(section)) {
            return res.json({ success: false, message: 'Invalid section' });
        }

        if (!title) {
            return res.json({ success: false, message: 'Title is required' });
        }

        if (id) {
            const existing = await firmContentModel.findById(id);
            if (!existing) {
                return res.json({ success: false, message: 'Item not found' });
            }

            existing.title = title;
            existing.description = description || '';
            existing.stock = stock || '';
            if (order !== undefined) existing.order = Number(order);
            existing.date = Date.now();
            await existing.save();

            return res.json({ success: true, message: 'Item updated', item: existing });
        }

        const doc = new firmContentModel({
            section,
            title,
            description: description || '',
            stock: stock || '',
            order: order !== undefined ? Number(order) : 0
        });
        await doc.save();

        res.json({ success: true, message: 'Item created', item: doc });
    } catch (error) {
        console.error('Error saving firm item:', error);
        res.json({ success: false, message: error.message });
    }
};

// Admin: delete list item
const deleteFirmItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await firmContentModel.findByIdAndDelete(id);
        if (!deleted) {
            return res.json({ success: false, message: 'Item not found' });
        }
        res.json({ success: true, message: 'Item deleted' });
    } catch (error) {
        console.error('Error deleting firm item:', error);
        res.json({ success: false, message: error.message });
    }
};

export { getFirmContent, upsertFirmHeroImage, upsertFirmItem, deleteFirmItem };


