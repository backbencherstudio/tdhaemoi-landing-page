import axiosClient from "../../lip/axiosClient";

// create products admin
export const createProducts = async (productData) => {
    try {
        const formData = new FormData();

        // Add all product fields to formData
        formData.append('name', productData.name);
        formData.append('brand', productData.brand);
        formData.append('Category', productData.Category);
        formData.append('Sub_Category', productData.Sub_Category);
        formData.append('typeOfShoes', productData.typeOfShoes);
        formData.append('productDesc', productData.productDesc);
        formData.append('price', productData.price);
        formData.append('availability', String(productData.availability)); // Convert boolean to string
        formData.append('offer', productData.offer);
        formData.append('size', JSON.stringify(productData.size)); // Convert array to JSON string
        formData.append('feetFirstFit', productData.feetFirstFit);
        formData.append('footLength', productData.footLength);
        formData.append('color', productData.color);
        formData.append('technicalData', productData.technicalData);
        formData.append('Company', productData.Company);
        formData.append('gender', productData.gender);

        // Handle multiple images
        if (productData.images && productData.images.length > 0) {
            productData.images.forEach((image) => {
                formData.append('images', image);
            });
        }

        const response = await axiosClient.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        // Enhanced error handling
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
        throw new Error(errorMessage);
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

        return {
            products: response.data.products || [],
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
        
        // Add all product fields to formData
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
        formData.append('color', productData.color);
        formData.append('technicalData', productData.technicalData);
        formData.append('Company', productData.Company);
        formData.append('gender', productData.gender);

        // Handle multiple images
        if (productData.images && productData.images.length > 0) {
            productData.images.forEach((image) => {
                formData.append('images', image);
            });
        }

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
export const getAllProducts = async ({
    search = '',
    minPrice,
    maxPrice,
    category,
    typeOfShoes,
    gender,
    subCategory,
    size,
    color,
    page = 1,
    limit = 8,
    sortBy,
    sortOrder
}) => {
    try {
        const queryParams = new URLSearchParams();
        if (search?.trim()) queryParams.append('search', search.trim());
        if (category) queryParams.append('category', category);
        if (subCategory) queryParams.append('subCategory', subCategory);
        if (size) queryParams.append('size', size);
        if (color) queryParams.append('color', color);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);
        if (gender) queryParams.append('gender', gender);
        if (typeOfShoes) queryParams.append('typeOfShoes', typeOfShoes);
        queryParams.append('page', page);
        queryParams.append('limit', limit);
        if (sortBy) queryParams.append('sortBy', sortBy);
        if (sortOrder) queryParams.append('sortOrder', sortOrder);

        const response = await axiosClient.get(`/products/query?${queryParams.toString()}`);
        
        return {
            products: response.data.products || [],
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


// Get product by ID client site 
export const getProductById = async (id) => {
    try {
        const response = await axiosClient.get(`/products/${id}`);
        // Check if response.data exists and has the correct structure
        if (response.data && response.data.success && response.data.product) {
            return response.data.product;
        }
        throw new Error('Product not found');
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch product';
        throw new Error(errorMessage);
    }
}