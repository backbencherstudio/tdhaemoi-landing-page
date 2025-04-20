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
        formData.append('offer', productData.offer || '0');
        formData.append('size', JSON.stringify(productData.size));
        formData.append('feetFirstFit', productData.feetFirstFit);
        formData.append('footLength', productData.footLength);
        formData.append('technicalData', productData.technicalData);
        formData.append('Company', productData.Company);
        formData.append('gender', productData.gender);

        // Handle color variants and their images
        const colorsArray = productData.colorVariants.map(variant => ({
            id: variant.id,
            colorName: variant.colorName,
            colorCode: variant.colorCode,
            images: variant.images.map(img => {
                if (img.isExisting) {
                    // Keep existing image data
                    return {
                        id: img.id,
                        url: img.url,
                    };
                }
                return null;
            }).filter(Boolean)
        }));

        // Handle new image uploads
        let imageIndex = 0;
        productData.colorVariants.forEach((variant, colorIndex) => {
            variant.images.forEach(img => {
                if (!img.isExisting && img.file instanceof File) {
                    const fileExtension = img.file.name.split('.').pop();
                    const uniqueFileName = `${Date.now()}_${colorIndex}_${imageIndex}.${fileExtension}`;

                    const renamedFile = new File([img.file], uniqueFileName, {
                        type: img.file.type
                    });

                    formData.append('images', renamedFile);

                    // Add new image reference to the corresponding color
                    colorsArray[colorIndex].images.push({
                        filename: uniqueFileName,
                        isNew: true
                    });

                    imageIndex++;
                }
            });
        });

        // Add color data to formData
        formData.append('colors', JSON.stringify(colorsArray));

        // Log the data being sent (for debugging)
        console.log('Update Data:', {
            colors: colorsArray,
            formDataEntries: Array.from(formData.entries()).map(([key, value]) => ({
                key,
                value: key === 'colors' ? JSON.parse(value) : value
            }))
        });

        const response = await axiosClient.put(`/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Update Error:', error);
        throw new Error(error.response?.data?.message || error.message || 'Failed to update product');
    }
};


// delete single image product admin
export const deleteSingleImage = async (productId, imageFilename) => {
    try {
        const response = await axiosClient.delete(`/products/${productId}/${imageFilename}`);

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to delete image');
        }

        return response.data;
    } catch (error) {
        console.error('Error deleting image:', error);
        throw new Error(error.response?.data?.message || error.message || 'Failed to delete image');
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
    
    // Batch process all filters
    Object.entries(filters).forEach(([key, value]) => {
        if (value) {
            if (Array.isArray(value) && value.length > 0) {
                // Handle arrays (sizes, colors, and typeOfShoes) in batch
                if (key === 'size') {
                    value.sort().forEach(size => {
                        queryParams.append('size[]', size);
                    });
                } else if (key === 'colors') {
                    value.forEach(color => {
                        queryParams.append('colorName[]', color);
                    });
                } else if (key === 'typeOfShoes') {
                    value.sort().forEach(type => {
                        queryParams.append('typeOfShoes[]', type);
                    });
                }
            } else if (value) {
                queryParams.append(key, value);
            }
        }
    });

    try {
        const response = await axiosClient.get(`/products/query?${queryParams}`);

        if (!response.data.products || response.data.products.length === 0) {
            return {
                products: [],
                total: 0,
                currentPage: filters.page || 1,
                totalPages: 0,
                itemsPerPage: filters.limit || 10,
                hasNextPage: false,
                hasPreviousPage: false
            };
        }

        // Transform the products without any filtering
        const transformedProducts = response.data.products.map(product => ({
            ...product,
            size: typeof product.size === 'string' ? JSON.parse(product.size) : product.size,
            colorVariants: product.colors.map(color => ({
                name: color.colorName,
                code: color.colorCode,
                mainImage: color.images[0]?.url || null,
                images: color.images.map(img => img.url)
            }))
        }));

        return {
            products: transformedProducts,
            total: response.data.pagination?.total || 0,
            currentPage: response.data.pagination?.currentPage || filters.page,
            totalPages: response.data.pagination?.totalPages || 1,
            itemsPerPage: response.data.pagination?.itemsPerPage || filters.limit,
            hasNextPage: response.data.pagination?.hasNextPage || false,
            hasPreviousPage: response.data.pagination?.hasPreviousPage || false
        };
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
});


// get product by id admin
export const getProductById = async (id) => {
    try {
        const response = await axiosClient.get(`/products/${id}`);
        if (response.data && response.data.success && response.data.product) {
            const product = response.data.product;

            return {
                ...product,
                size: Array.isArray(product.size) ? product.size :
                    typeof product.size === 'string' ? JSON.parse(product.size) : [],
                colorVariants: product.colors?.map(color => ({
                    id: color.id,
                    colorName: color.colorName,
                    colorCode: color.colorCode,
                    images: color.images.map(img => ({
                        id: img.id,
                        url: img.url,
                        preview: img.url,
                        name: `Image ${img.id}`,
                        isExisting: true,
                        file: null // Add this to maintain structure
                    }))
                })) || []
            };
        }
        throw new Error('Product not found');
    } catch (error) {
        console.error('Error fetching product:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
}

export const getProductByIdclient = async (id) => {
    try {
        const response = await axiosClient.get(`/products/${id}`);
        if (response.data && response.data.success) {
            const product = response.data.product;
            const recommendedProducts = response.data.recommendedProducts || [];

            return {
                product: {
                    ...product,
                    size: Array.isArray(product.size) ? product.size :
                        typeof product.size === 'string' ? JSON.parse(product.size) : [],
                    colorVariants: product.colors?.map(color => ({
                        id: color.id,
                        colorName: color.colorName,
                        colorCode: color.colorCode,
                        images: color.images.map(img => ({
                            id: img.id,
                            url: img.url,
                            preview: img.url,
                            name: `Image ${img.id}`,
                            isExisting: true,
                            file: null
                        }))
                    })) || []
                },
                recommendedProducts
            };
        }
        throw new Error('Product not found');
    } catch (error) {
        console.error('Error fetching product:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
}