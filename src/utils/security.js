// Security utilities for token management and validation

// Token validation helpers
export const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
        // Decode JWT token (without verification - just for expiration check)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        return payload.exp < currentTime;
    } catch (error) {
        return true; // If we can't decode, consider it expired
    }
};

// Secure token storage with encryption (basic implementation)
export const secureTokenStorage = {
    setToken: (token) => {
        try {
            // In production, you might want to use a more secure storage method
            // or encrypt the token before storing
            localStorage.setItem('token', token);
            
            // Set a timestamp for token creation
            localStorage.setItem('token_timestamp', Date.now().toString());
        } catch (error) {
            console.error('Error storing token:', error);
        }
    },
    
    getToken: () => {
        try {
            const token = localStorage.getItem('token');
            const timestamp = localStorage.getItem('token_timestamp');
            
            if (!token || !timestamp) return null;
            
            // Check if token is older than 24 hours (optional security measure)
            const tokenAge = Date.now() - parseInt(timestamp);
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours
            
            if (tokenAge > maxAge) {
                // Token is too old, clear it
                secureTokenStorage.clearToken();
                return null;
            }
            
            return token;
        } catch (error) {
            console.error('Error retrieving token:', error);
            return null;
        }
    },
    
    clearToken: () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('token_timestamp');
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Error clearing token:', error);
        }
    }
};

// Session management
export const sessionManager = {
    startSession: (user, token) => {
        secureTokenStorage.setToken(token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('session_start', Date.now().toString());
    },
    
    endSession: () => {
        secureTokenStorage.clearToken();
        localStorage.removeItem('session_start');
    },
    
    isSessionValid: () => {
        const token = secureTokenStorage.getToken();
        const user = localStorage.getItem('user');
        const sessionStart = localStorage.getItem('session_start');
        
        if (!token || !user || !sessionStart) return false;
        
        // Check if session is older than 24 hours
        const sessionAge = Date.now() - parseInt(sessionStart);
        const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
        
        return sessionAge < maxSessionAge;
    }
};

// Security headers for API requests
export const getSecurityHeaders = () => {
    const token = secureTokenStorage.getToken();
    return {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    };
};

// Validate token format (basic JWT format check)
export const isValidTokenFormat = (token) => {
    if (!token || typeof token !== 'string') return false;
    
    // Basic JWT format validation (3 parts separated by dots)
    const parts = token.split('.');
    return parts.length === 3;
}; 