import axiosClient from "../../lip/axiosClient";
import { cache } from 'react';

// create products admin
export const createProducts = async (productData) => {
    try {
        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('brand', productData.brand);
        formData.append('Category', productData.Category);
        formData.append('Sub_Category', productData.Sub_Category);
        formData.append('typeOfShoes', productData.typeOfShoes);
        formData.append('productDesc', productData.productDesc);
        formData.append('price', productData.price);
        formData.append('availability', String(productData.availability));
        formData.append('offer', productData.offer);
        formData.append('size', JSON.stringify(productData.size));
        formData.append('feetFirstFit', productData.feetFirstFit);
        formData.append('footLength', productData.footLength);
        formData.append('technicalData', productData.technicalData);
        formData.append('Company', productData.Company);
        formData.append('gender', productData.gender);
        // Add images with color information
        let imageIndex = 0;
        productData.colorVariants.forEach((variant, colorIndex) => {
            variant.images.forEach(img => {
                const fileExtension = img.file.name.split('.').pop();
                const uniqueFileName = `${Date.now()}_${colorIndex}_${imageIndex}.${fileExtension}`;
                const renamedFile = new File([img.file], uniqueFileName, {
                    type: img.file.type
                });

                formData.append('images', renamedFile);
                imageIndex++;
            });
        });
        const colorsArray = productData.colorVariants.map((variant, colorIndex) => ({
            colorName: variant.colorName,
            colorCode: variant.colorCode,
            images: variant.images.map((_, imgIndex) => {
                const fileExtension = variant.images[imgIndex].file.name.split('.').pop();
                return `${Date.now()}_${colorIndex}_${imgIndex}.${fileExtension}`;
            })
        }));

        formData.append('colors', JSON.stringify(colorsArray));
        const response = await axiosClient.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        // console.error('API Error:', error.response?.data || error);
        throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
    }
}

// admin get all product
export const getAllProduct = async ({
    search = '',
    page = 1,
    limit = 2
} = {}) => {
    try {
        const queryParams = new URLSearchParams();
        if (search?.trim()) queryParams.append('search', search.trim());
        queryParams.append('page', page);
        queryParams.append('limit', limit);

        const response = await axiosClient.get(`/products/query?${queryParams}`);

        // Transform the response to include color information
        const transformedProducts = response.data.products.map(product => ({
            ...product,
            // Parse size string to array if it's a string
            size: typeof product.size === 'string' ? JSON.parse(product.size) : product.size,
            // Get all unique colors
            allColors: product.colors.map(color => ({
                name: color.colorName,
                code: color.colorCode,
                mainImage: color.images[0]?.url || null
            }))
        }));

        return {
            products: transformedProducts,
            total: response.data.pagination?.total || 0,
            currentPage: response.data.pagination?.currentPage || page,
            totalPages: response.data.pagination?.totalPages || 1,
            itemsPerPage: response.data.pagination?.itemsPerPage || limit,
            hasNextPage: response.data.pagination?.hasNextPage || false,
            hasPreviousPage: response.data.pagination?.hasPreviousPage || false
        };
    } catch (error) {
        console.error('API Error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch products';
        throw new Error(errorMessage);
    }
}

// update product admin
export const updateProduct = async (id, productData) => {
    try {
        const formData = new FormData();

        // Add basic product fields
        formData.append('name', productData.name);
        formData.append('brand', productData.brand);
        formData.append('Category', productData.Category);
        formData.append('Sub_Category', productData.Sub_Category);
        formData.append('typeOfShoes', productData.typeOfShoes);
        formData.append('productDesc', productData.productDesc);
        formData.append('price', productData.price);
        formData.append('availability', String(productData.availability));
        formData.append('offer', productData.offer);
        formData.append('size', JSON.stringify(productData.size));
        formData.append('feetFirstFit', productData.feetFirstFit);
        formData.append('footLength', productData.footLength);
        formData.append('technicalData', productData.technicalData);
        formData.append('Company', productData.Company);
        formData.append('gender', productData.gender);

        // Handle color variants and their images
        productData.colors.forEach((colorVariant, colorIndex) => {
            formData.append(`colors[${colorIndex}][colorName]`, colorVariant.colorName);
            formData.append(`colors[${colorIndex}][colorCode]`, colorVariant.colorCode);

            // Append images for each color variant
            colorVariant.images.forEach((image, imageIndex) => {
                // If it's an existing image URL, send the URL
                if (typeof image === 'string') {
                    formData.append(`colors[${colorIndex}][existingImages]`, image);
                } else {
                    // If it's a new file, send the file
                    formData.append(`colors[${colorIndex}][images]`, image);
                }
            });
        });

        const response = await axiosClient.put(`/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update product';
        throw new Error(errorMessage);
    }
}


// delete single image product admin
export const deleteSingleImage = async (id, imageFilename) => {
    try {
        const response = await axiosClient.delete(`/products/${id}/${imageFilename}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete image';
        throw new Error(errorMessage);
    }
}

// delete product admin
export const deleteProduct = async (id) => {
    try {
        const response = await axiosClient.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Failed to delete product');
    }
}



// Get all products with filters client site 
export const getAllProducts = cache(async (filters) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
    });

    try {
        const response = await axiosClient.get(`/products/query?${queryParams}`, {
            headers: {
                'Cache-Control': 'max-age=300',
            }
        });

        return {
            products: response.data.products || [],
            ...response.data.pagination
        };
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
});


// Get product by ID client site 
export const getProductById = async (id) => {
    try {
        const response = await axiosClient.get(`/products/${id}`);
        if (response.data && response.data.success && response.data.product) {
            const product = response.data.product;

            // Transform the color variants data if needed
            if (product.colors) {
                product.colorVariants = product.colors.map(color => ({
                    colorName: color.colorName,
                    colorCode: color.colorCode,
                    images: color.images.map((url, index) => ({
                        id: `existing-${index}`,
                        preview: url,
                        name: `Image ${index + 1}`,
                        isExisting: true,
                        url: url
                    }))
                }));
            }

            return product;
        }
        throw new Error('Product not found');
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch product';
        throw new Error(errorMessage);
    }
}