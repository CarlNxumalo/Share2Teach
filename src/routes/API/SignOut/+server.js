import { json } from "@sveltejs/kit";

export const POST = async ({ request, cookies }) => {
    try {
        
        cookies.set('token', '', {
            path: '/', 
            httpOnly: true, 
            sameSite: 'strict',
            maxAge: 0       // Setting Max-Age to 0 effectively deletes the cookie
        });

        return json({ success: true });
    } catch (error) {
        console.error('Error during sign-out:', error);
        return json({ message: 'Failed to sign out user: ', error: error.message }, { status: 500 });
    }
};


