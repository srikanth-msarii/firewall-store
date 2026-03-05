import { Readable } from 'stream';
import csv from 'csv-parser';
import Product from '../models/Product.js';
import Brand from '../models/Brand.js';
import Category from '../models/Category.js';

// @desc    Bulk upload products via CSV
// @route   POST /api/products/bulk-upload
// @access  Private/Admin
export const bulkUploadProducts = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a CSV file' });
    }

    const results = [];
    const stream = Readable.from(req.file.buffer);

    stream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                let created = 0;
                let updated = 0;
                let errors = 0;

                for (const row of results) {
                    try {
                        // Basic validation
                        if (!row.model || !row.name) {
                            errors++;
                            continue;
                        }

                        // Upsert Brand and Category
                        if (row.brand) {
                            await Brand.findOneAndUpdate(
                                { name: row.brand },
                                { name: row.brand },
                                { upsert: true, new: true }
                            );
                        }
                        if (row.category) {
                            await Category.findOneAndUpdate(
                                { name: row.category },
                                { name: row.category },
                                { upsert: true, new: true }
                            );
                        }

                        // Check if product exists by model
                        const existingProduct = await Product.findOne({ model: row.model });

                        // Helper to safely parse JSON
                        const parseJSON = (str) => {
                            if (!str) return [];
                            try {
                                // If it's already an array/object, return it (though CSV parser usually gives strings)
                                if (typeof str === 'object') return str;
                                // Handle common CSV issues like double quotes
                                const cleaned = str.replace(/""/g, '"');
                                return JSON.parse(cleaned);
                            } catch (e) {
                                console.warn('Failed to parse JSON field:', str);
                                return [];
                            }
                        };

                        const productData = {
                            model: row.model,
                            name: row.name,
                            category: row.category,
                            brand: row.brand,
                            price: row.price,
                            stock: Number(row.stock) || 0,
                            shortDescription: row.shortDescription,
                            longDescription: row.longDescription,
                            featured: row.featured === 'true' || row.featured === true,
                            datasheetUrl: row.datasheetUrl,
                            // Parse complex fields
                            specs: parseJSON(row.specs),
                            reviews: parseJSON(row.reviews),
                            questions: parseJSON(row.questions),
                        };                    // Add other fields as needed, handling potential missing values


                        if (existingProduct) {
                            await Product.updateOne({ model: row.model }, productData);
                            updated++;
                        } else {
                            await Product.create(productData);
                            created++;
                        }
                    } catch (err) {
                        console.error(`Error processing row ${row.model}:`, err);
                        errors++;
                    }
                }

                res.json({
                    message: 'Bulk upload processed',
                    stats: { created, updated, errors },
                });
            } catch (error) {
                res.status(500).json({ message: 'Server Error', error: error.message });
            }
        });
};
