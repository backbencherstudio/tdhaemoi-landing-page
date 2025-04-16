import axiosClient from "../../lip/axiosClient";

export const loginUser = async (email, password) => {
    try {
        const response = await axiosClient.post('/users/login', {
            email,
            password,
        });

        if (!response.data?.token) {
            throw new Error('Invalid response from server');
        }

        return {
            success: true,
            message: response.data.message || 'Successfully logged in!',
            token: response.data.token,
            user: response.data.user
        };
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'An error occurred during login';
        throw new Error(errorMessage);
    }
};

export const checkAuth = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};


// update user profile
export const updateUserProfile = async (id, userData) => {
    try {
        const formData = new FormData();
        if (userData.name) formData.append('name', userData.name);
        if (userData.email) {
            formData.append('email', userData.email.toLowerCase().trim());
        }
        if (userData.image instanceof File) {
            formData.append('image', userData.image);
        }
        const response = await axiosClient.put(`/users/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (!response.data.user || !response.data.user.email) {
            throw new Error('Invalid response from server');
        }
        return {
            success: true,
            user: {
                ...response.data.user,
                email: response.data.user.email.toLowerCase().trim()
            },
            message: response.data.message || 'Profile updated successfully'
        };
    } catch (error) {
        if (error.response?.data?.message?.toLowerCase().includes('email')) {
            throw new Error('This email address is already in use');
        }
        const errorMessage = error.response?.data?.message || 'Error updating profile';
        throw new Error(errorMessage);
    }
};


// change password
export const changePassword = async (oldPassword, newPassword) => {
    try {
        const response = await axiosClient.patch('/users/change-password', {
            oldPassword,
            newPassword
        });

        if (!response.data) {
            throw new Error('Invalid response from server');
        }

        return {
            success: true,
            message: response.data.message || 'Password changed successfully'
        };
    } catch (error) {
        // console.error('Password change error:', error.response || error);
        const errorMessage = error.response?.data?.message || 'Failed to change password';
        throw new Error(errorMessage);
    }
};