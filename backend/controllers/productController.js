import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js'
// function for add product 

const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, firmness, size, point1, point2, point3, specifications, rating, discount, bestseller } = req.body;

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        const imagesUrl = await Promise.all(
            images.map(async (item) => {
                const result = await cloudinary.uploader.upload(item.path, {
                    resource_type: 'image',
                });
                return result.secure_url;
            })
        );

        console.log('=== ADD PRODUCT DEBUG ===');
        console.log('Basic fields:', { name, description, price, category, subCategory, sizes, firmness, size, rating, discount, bestseller });
        console.log('Points data:', { point1, point2, point3 });
        console.log('Images:', { image1, image2, image3, image4 });
        console.log('Images URLs:', imagesUrl);

        // Parse specifications if provided
        let parsedSpecifications = [];
        if (specifications) {
            try {
                parsedSpecifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
            } catch (e) {
                console.log('Error parsing specifications:', e);
                parsedSpecifications = [];
            }
        }

        const productData = {
            name,
            description,
            category: category || 'Mattress',
            price: Number(price),
            subCategory: subCategory || 'General',
            firmness: firmness || 'Medium',
            size: size || 'Queen',
            point1,
            point2,
            point3,
            specifications: parsedSpecifications,
            rating: Number(rating) || 4.5,
            discount: Number(discount) || 0,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()

        }

        const product = productModel(productData);
        await product.save()
        res.json({ success: true, message: "Product Added" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

const listProducts = async (req, res) => {
    try {
        const { size, firmness, category, subCategory } = req.query;
        
        // Build filter object
        const filter = {};
        
        if (size && size !== 'All') {
            filter.$or = [
                { sizes: { $in: [size] } },
                { size: size }
            ];
        }
        
        if (firmness && firmness !== 'All') {
            filter.firmness = firmness;
        }
        
        if (category) {
            filter.category = category;
        }
        
        if (subCategory) {
            filter.subCategory = subCategory;
        }
        
        const products = await productModel.find(filter);
        console.log('=== LIST PRODUCTS DEBUG ===');
        console.log('Found products:', products.length);
        if (products.length > 0) {
            console.log('First product points:', {
                name: products[0].name,
                point1: products[0].point1,
                point2: products[0].point2,
                point3: products[0].point3
            });
        }
        res.json({ success: true, products })
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Removed !" })
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({ success: true, product })
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price, category, subCategory, sizes, firmness, size, point1, point2, point3, specifications, rating, discount, bestseller, existingImages } = req.body;

        const product = await productModel.findById(id);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        // Process images
        let imagesUrl = product.image || [];

        // If existingImages is passed, filter/keep only those, or parse them
        if (existingImages) {
            try {
                imagesUrl = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
            } catch (e) {
                console.log('Error parsing existingImages:', e);
            }
        }

        // Check for new files uploaded
        const image1 = req.files && req.files.image1 && req.files.image1[0];
        const image2 = req.files && req.files.image2 && req.files.image2[0];
        const image3 = req.files && req.files.image3 && req.files.image3[0];
        const image4 = req.files && req.files.image4 && req.files.image4[0];

        const newImages = [image1, image2, image3, image4].filter((item) => item !== undefined);

        if (newImages.length > 0) {
            const newImagesUrl = await Promise.all(
                newImages.map(async (item) => {
                    const result = await cloudinary.uploader.upload(item.path, {
                        resource_type: 'image',
                    });
                    return result.secure_url;
                })
            );
            imagesUrl = [...imagesUrl, ...newImagesUrl].slice(0, 4);
        }

        // Parse specifications
        let parsedSpecifications = [];
        if (specifications) {
            try {
                parsedSpecifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
            } catch (e) {
                console.log('Error parsing specifications:', e);
                parsedSpecifications = [];
            }
        }

        product.name = name;
        product.description = description;
        product.category = category || product.category || 'Mattress';
        product.price = Number(price);
        product.subCategory = subCategory || 'General';
        product.firmness = firmness || 'Medium';
        product.size = size || product.size || 'Queen';
        product.point1 = point1;
        product.point2 = point2;
        product.point3 = point3;
        product.specifications = parsedSpecifications;
        product.rating = Number(rating) || 4.5;
        product.discount = Number(discount) || 0;
        product.bestseller = bestseller === "true" || bestseller === true ? true : false;
        product.sizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
        product.image = imagesUrl;

        await product.save();
        res.json({ success: true, message: "Product Updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addProduct, listProducts, removeProduct, singleProduct, updateProduct };