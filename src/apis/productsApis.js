import axiosClient from "../../lip/axiosClient";

// create products 
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




// Get all products with filters
export const getAllProducts = async ({
    name,
    brand,
    minPrice,
    maxPrice,
    category,
    subCategory,
    size,
    color,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
} = {}) => {
    try {
        // Build query parameters
        const queryParams = new URLSearchParams();

        // Add filters if they exist
        if (name) queryParams.append('name', name);
        if (brand) queryParams.append('brand', brand);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);
        if (category) queryParams.append('category', category);
        if (subCategory) queryParams.append('subCategory', subCategory);
        if (size) queryParams.append('size', size);
        if (color) queryParams.append('color', color);

        // Add pagination and sorting
        queryParams.append('page', page);
        queryParams.append('limit', limit);
        if (sortBy) queryParams.append('sortBy', sortBy);
        if (sortOrder) queryParams.append('sortOrder', sortOrder);

        // Make the API call
        const response = await axiosClient.get(`/products/query?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch products';
        throw new Error(errorMessage);
    }
}

// Get product by ID
export const getProductById = async (id) => {
    try {
        const response = await axiosClient.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch product';
        throw new Error(errorMessage);
    }
}