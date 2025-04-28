import axiosClient from "../../lip/axiosClient";
import { cache } from 'react';

// create products admin
export const createProducts = async (productData) => {
    try {
        const formData = new FormData();
        
        // Basic product information
        formData.append('name', productData.productName);
        formData.append('brand', productData.brand);
        formData.append('Category', productData.category);
        formData.append('Sub_Category', productData.subCategory);
        formData.append('typeOfShoes', productData.typeOfShoes);
        formData.append('productDesc', productData.productDesc);
        formData.append('price', productData.price);
        formData.append('availability', String(productData.availability));
        formData.append('offer', productData.offer || '0');
        
        // Handle size and quantities
        const sizeData = productData.size.map(size => ({
            size: size,
            quantity: parseInt(productData.sizeQuantities[size]) || 0
        }));
        formData.append('size', JSON.stringify(sizeData));
        
        // Technical information
        formData.append('feetFirstFit', productData.feetFirstFit || '');
        formData.append('footLength', productData.footLength || '');
        formData.append('technicalData', productData.technicalData || '');
        formData.append('Company', productData.company || '');
        formData.append('gender', productData.gender);
        
        // Process questions and answers
        const questionData = {
            category: productData.category,
            subCategory: productData.subCategory || null,
            answers: Object.entries(productData.selectedAnswers || {}).map(([questionKey, value]) => ({
                questionKey,
                answer: value.value,  // Use the value property
                question: value.question,
                isNested: value.isNested
            }))
        };
        formData.append('question', JSON.stringify(questionData));
        
        // Add characteristics
        formData.append('characteristics', JSON.stringify(productData.characteristics));

        // Handle color variants and images
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

        // Prepare color data
        const colorsArray = productData.colorVariants.map((variant, colorIndex) => ({
            colorName: variant.colorName,
            colorCode: variant.colorCode,
            images: variant.images.map((_, imgIndex) => {
                const fileExtension = variant.images[imgIndex].file.name.split('.').pop();
                return `${Date.now()}_${colorIndex}_${imgIndex}.${fileExtension}`;
            })
        }));
        formData.append('colors', JSON.stringify(colorsArray));

        // Log formData for debugging
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        // Send the request
        const response = await axiosClient.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
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

        // Basic product fields
        formData.append('name', productData.productName);
        formData.append('brand', productData.brand);
        formData.append('Category', productData.category);
        formData.append('Sub_Category', productData.subCategory);
        formData.append('typeOfShoes', productData.typeOfShoes);
        formData.append('productDesc', productData.productDesc);
        formData.append('price', productData.price);
        formData.append('availability', String(productData.availability));
        formData.append('offer', productData.offer || '0');

        // Handle size and quantities
        const sizeData = productData.size.map(size => ({
            size: size,
            quantity: parseInt(productData.sizeQuantities[size]) || 0
        }));
        formData.append('size', JSON.stringify(sizeData));

        // Technical information
        formData.append('feetFirstFit', productData.feetFirstFit || '');
        formData.append('footLength', productData.footLength || '');
        formData.append('technicalData', productData.technicalData || '');
        formData.append('Company', productData.company || '');
        formData.append('gender', productData.gender);

        // Handle questions and answers
        const questionData = {
            category: productData.category,
            subCategory: productData.subCategory || null,
            answers: Object.entries(productData.selectedAnswers || {}).map(([questionKey, value]) => ({
                questionKey,
                answer: value.value,  
                question: value.question,
                isNested: value.isNested
            }))
        };
        formData.append('question', JSON.stringify(questionData));

        // Add characteristics
        formData.append('characteristics', JSON.stringify(productData.characteristics));

        // Handle color variants and their images
        const colorsArray = productData.colorVariants.map(variant => ({
            id: variant.id,
            colorName: variant.colorName,
            colorCode: variant.colorCode,
            images: variant.images.map(img => {
                if (img.isExisting) {
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

        console.log('Update Data:', {
            colors: colorsArray,
            formDataEntries: Array.from(formData.entries()).map(([key, value]) => ({
                key,
                value: key === 'colors' ? JSON.parse(value) : value
            }))
        });

        // Add this before the axios request in updateProduct
        console.log('Question Data being sent:', JSON.stringify({
            category: productData.category,
            subCategory: productData.subCategory,
            answers: Object.entries(productData.selectedAnswers || {}).map(([questionKey, value]) => ({
                questionKey,
                answer: value.value,
                question: value.question,
                isNested: value.isNested
            }))
        }, null, 2));

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

            // Helper function to format gender
            const formatGender = (gender) => {
                if (!gender) return '';
                // Convert MALE -> male, FEMALE -> female, UNISEX -> unisex
                return gender.toLowerCase();
            };

            // Parse question data
            let parsedQuestions = {};
            if (product.question) {
                try {
                    const questionData = typeof product.question === 'string' 
                        ? JSON.parse(product.question) 
                        : product.question;

                    // Parse answers array from the question data
                    if (questionData.answers && Array.isArray(questionData.answers)) {
                        questionData.answers.forEach(answer => {
                            const { questionKey, answer: answerValue } = answer;
                            
                            // Create the value in the expected format
                            parsedQuestions[questionKey] = {
                                value: answerValue,
                                answer: answerValue,
                                isNested: questionKey.startsWith('nested_'),
                                // Reconstruct the full answer structure
                                question: `${questionKey}_${answerValue.split('_').pop()}`
                            };
                        });
                    }

                    // Stringify the parsed questions for debugging
                    console.log('Parsed Questions:', JSON.stringify(parsedQuestions, null, 2));
                } catch (error) {
                    console.error('Error parsing question data:', error);
                }
            }

            // Parse size data
            let sizeData = [];
            let sizeQuantities = {};
            try {
                const parsedSize = typeof product.size === 'string' 
                    ? JSON.parse(product.size) 
                    : product.size;

                if (Array.isArray(parsedSize)) {
                    if (parsedSize.length > 0 && typeof parsedSize[0] === 'object') {
                        sizeData = parsedSize.map(item => item.size);
                        sizeQuantities = parsedSize.reduce((acc, item) => ({
                            ...acc,
                            [item.size]: item.quantity
                        }), {});
                    } else {
                        sizeData = parsedSize;
                    }
                }
            } catch (error) {
                console.error('Error parsing size data:', error);
            }

            const transformedProduct = {
                ...product,
                productName: product.name,
                category: product.Category?.toLowerCase(),
                gender: formatGender(product.gender),
                subCategory: product.Sub_Category?.toLowerCase(),
                size: sizeData,
                sizeQuantities: sizeQuantities,
                selectedAnswers: parsedQuestions,
                characteristics: Array.isArray(product.characteristics) 
                    ? product.characteristics.map(c => c.id.toString())
                    : [],
                colorVariants: product.colors?.map(color => ({
                    id: color.id,
                    colorName: color.colorName,
                    colorCode: color.colorCode,
                    images: color.images.map(img => ({
                        id: img.id,
                        url: img.url,
                        preview: img.url,
                        isExisting: true,
                        file: null
                    }))
                })) || []
            };

            // Log the transformed product for debugging
            console.log('Transformed Product:', JSON.stringify(transformedProduct, null, 2));

            return transformedProduct;
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

// get CHARACTERISTICS
export const getCharacteristics = async () => {
    const response = await axiosClient.get('/products/technical-icons');
    try {
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch characteristics');
    }
}

// Get all categories
export const getAllCategories = async () => {
    try {
        const response = await axiosClient.get('/questions');
        if (response.data && response.data.level === "category") {
            return {
                success: true,
                data: response.data.data
            };
        }
        throw new Error('Invalid category data format');
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
}

// Get subcategories by category slug
export const getSubCategories = async (categorySlug) => {
    try {
        const response = await axiosClient.get(`/questions/${categorySlug}`);
        if (response.data) {
            if (!response.data.data || response.data.level !== "sub-categories") {
                return {
                    success: true,
                    data: []
                };
            }

            return {
                success: true,
                data: response.data.data
            };
        }

        return {
            success: true,
            data: []
        };
    } catch (error) {
        // console.log('Error fetching subcategories:', error);
        return {
            success: true,
            data: []
        };
    }
}

// Get questions by category/subcategory slug
export const getCategoryQuestions = async (categorySlug, subCategorySlug = null) => {
    try {
        const formattedCategorySlug = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
        let endpoint = `/questions/${formattedCategorySlug}`;

        if (subCategorySlug) {
            const formattedSubCategorySlug = subCategorySlug.charAt(0).toUpperCase() + subCategorySlug.slice(1);
            endpoint = `/questions/${formattedCategorySlug}/${formattedSubCategorySlug}`;
        }
        const response = await axiosClient.get(endpoint);
        return {
            success: true,
            data: response.data.questions || [],
            nextQuestions: response.data.nextQuestions || null
        };
    } catch (error) {
        // console.error('Error fetching questions:', error);
        return {
            success: true,
            data: [],
            nextQuestions: null
        };
    }
}

