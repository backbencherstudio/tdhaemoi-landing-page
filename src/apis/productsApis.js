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

        // Add all filters to query params
        if (name) queryParams.append('name', name);
        if (brand) queryParams.append('brand', brand);
        if (category) queryParams.append('category', category);
        if (subCategory) queryParams.append('subCategory', subCategory);
        if (size) queryParams.append('size', size);
        if (color) queryParams.append('color', color);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);
        if (gender) queryParams.append('gender', gender);
        if (typeOfShoes) queryParams.append('typeOfShoes', typeOfShoes);
        
        // Add pagination params
        queryParams.append('page', page);
        queryParams.append('limit', limit);

        // Add sorting
        if (sortBy) queryParams.append('sortBy', sortBy);
        if (sortOrder) queryParams.append('sortOrder', sortOrder);

        const response = await axiosClient.get(`/products/query?${queryParams.toString()}`);
        return {
            products: response.data.products || [],
            total: response.data.total || 0,
            currentPage: response.data.currentPage || page,
            totalPages: response.data.totalPages || Math.ceil((response.data.total || 0) / limit)
        };
    } catch (error) {
        throw new Error(error.message || 'Failed to fetch products');
    }
}


// Get product by ID
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