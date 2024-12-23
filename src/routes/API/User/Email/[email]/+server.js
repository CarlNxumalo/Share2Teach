import UserDAO from '$lib/DAOClasses/UserDAO'; // Adjust as necessary
import { json } from '@sveltejs/kit';

const userDAO = new UserDAO();
await userDAO.connect();

/**
 * @swagger
 * /API/User/Email/{email}:
 *   get:
 *     tags: [Users]
 *     summary: Verify if an email exists in the database
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         description: Email address to verify
 *         schema:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *     responses:
 *       200:
 *         description: Email exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Email does not exist
 *       500:
 *         description: Internal Server Error
 */

export async function GET({ params }) {
    const { email } = params;

    try {
        const emailExists = await userDAO.emailExists(decodeURIComponent(email));
        
        if (emailExists) {
            return json({ exists: true }, { status: 200 });
        } else {
            return json({ exists: false }, { status: 404 });
        }
    } catch (error) {
        console.error('Error checking email:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
};

/** 
 * @swagger
 * /API/User/Email:
 *   put:
 *     tags: [Users]
 *     summary: Update User Password
 *     description: Updates the user's password if the email exists and the passwords match.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *       400:
 *         description: Bad request (e.g., passwords do not match or missing fields).
 *       404:
 *         description: Email does not exist.
 *       500:
 *         description: Internal server error.
 */

export async function PUT({ request }) {
    const url = new URL(request.url); // Create a URL object from the request URL
    const email = url.searchParams.get('email'); // Get the email from query parameters
    const newPassword = url.searchParams.get('newPassword'); // Get the new password from query parameters
    const confirmPassword = url.searchParams.get('confirmPassword'); // Get the confirm password from query parameters

    // Check if any of the required fields are missing
    if (!email || !newPassword || !confirmPassword) {
        return json({ error: 'Email, new password, and confirm password are required.' }, { status: 400 });
    }

    // Log password details for debugging
    console.log('New Password:', newPassword, 'Length:', newPassword.length);
    console.log('Confirm Password:', confirmPassword, 'Length:', confirmPassword.length);

    if (newPassword !== confirmPassword) {
        return json({ error: 'Passwords do not match.' }, { status: 400 });
    }

    try {
        const updated = await userDAO.updatePassword(email, newPassword, confirmPassword);
        if (updated) {
            return json({ message: 'Password updated successfully.' }, { status: 200 });
        } else {
            return json({ error: 'Email does not exist.' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error updating password:', error);
        return json({ error: error.message || 'Internal server error.' }, { status: 500 });
    }
}




