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
