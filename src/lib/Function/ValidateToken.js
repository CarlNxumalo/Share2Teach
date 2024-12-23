import jwt from 'jsonwebtoken';

// Function to check if a JWT token is valid and not expired
export function validateToken(token) {
    try {
        // Verify token's signature and expiration time
        const secret = 'your-secret-key';
        const decoded = jwt.verify(token, secret);

        // Return the decoded token if it's valid
        return { valid: true, expired: false, decoded };
    } 
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            // Token has expired
            return { valid: false, expired: true, decoded: null };
        } else if (error.name === 'JsonWebTokenError') {
            // Token is invalid
            return { valid: false, expired: false, decoded: null };
        } else {
            // Some other error occurred
            return { valid: false, expired: false, decoded: null };
        }
    }
}
