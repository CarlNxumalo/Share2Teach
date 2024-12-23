// src/routes/+layout.server.js
// @ts-ignore
export const load = async ({ url, locals }) => {
    // Simulate a reload by redirecting to the current URL
    console.log("this is the user role:  "+locals.role)
    return {
        status: 302, // HTTP status for redirection
        redirect: url.pathname, // Redirect to the current path
        role: locals.role,
        activeUrl: url.pathname
    };
};