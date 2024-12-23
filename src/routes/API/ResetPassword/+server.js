// src/routes/api/reset-password/+server.js
import { json } from '@sveltejs/kit';
import UserDAO from '$lib/DAOClasses/UserDAO.js';
import bcrypt from 'bcryptjs';

export async function POST({ request }) {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
        return json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    try {
        const userDAO = new UserDAO();
        const user = await userDAO.validatePassword(email, newPassword);

        if (!user) {
            return json({ success: false, message: 'Invalid email or password' }, { status: 404 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        user.password = hashedPassword; // Replace the user's password with the new hashed password
        const success = await userDAO.updateUser(user);

        if (success) {
            return json({ success: true, message: 'Password updated successfully' });
        } else {
            return json({ success: false, message: 'Failed to update password' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error:', error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
