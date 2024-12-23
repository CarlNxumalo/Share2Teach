import { json } from '@sveltejs/kit';
import UserDAO from '$lib/DAOClasses/UserDAO.js'; // Adjust as necessary

const userDAO = new UserDAO();

export const POST = async ({ request, cookies }) => {
    try {
        const { email, password } = await request.json();

        // Check for missing credentials
        if (!email || !password) {
            return json({ message: 'Missing email or password' }, { status: 400 });
        }

        // Validate user credentials
        const result = await userDAO.validateUser(email, password); // Use your existing validation method
        if (result) {
            // Set the JWT in an HTTP-only cookie (consider making this `httpOnly: true` for added security)
            cookies.set('token', result.token, {
                httpOnly: false, // More secure
                path: '/',
                maxAge: 3600, // 1 hour
                sameSite: 'strict',
                
            });

            // Return the user's email and role in the response
            return json({ message: 'Successfully Signed in!', user: { email: result.user.email, role: result.user.role } }, { status: 200 });
        } else {
            return json({ message: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error) {
        console.error('Error during sign-in:', error);
        return json({ message: 'Failed to sign in', error: error.message }, { status: 500 });
    }
};