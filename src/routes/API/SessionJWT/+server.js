import { validateToken } from '../../../lib/Function/ValidateToken.js';
import { json } from '@sveltejs/kit';

/**
 * @swagger
 * tags:
 *   name: SessionJWT
 *   description: API for managing JWT sessions
 */

/**
 * @swagger
 * /API/SessionJWT:
 *   get:
 *     summary: Validate a JWT token
 *     tags: [SessionJWT]
 *     responses:
 *       200:
 *         description: Token validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 decode:
 *                   type: object
 *                   description: Decoded token data if valid
 *       500:
 *         description: Internal Server Error
 */

export const GET = async ({ request, cookies }) => {
    try {
        const token = cookies.get('token');

        const validationResult = validateToken(token);

        if (validationResult.valid) {
            console.log('Token is valid:', validationResult.decoded);
        } else if (validationResult.expired) {
            console.log('Token has expired');
        } else {
            console.log('Token is invalid');
        }

        return json({ decode: validationResult.decoded });
    } catch (error) {
        console.error('Error Authenticating User', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
};
