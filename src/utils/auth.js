// Authentication utility functions

export const isAdminUser = (user) => {
    return user && user.role === 'ADMIN';
};

export const hasRole = (user, requiredRole) => {
    return user && user.role === requiredRole;
};

export const getUserRole = (user) => {
    return user ? user.role : null;
};

export const isAuthenticated = (user) => {
    return !!user;
};

// Check if user can access admin dashboard
export const canAccessAdminDashboard = (user) => {
    return isAdminUser(user);
}; 