import { validateToken } from "$lib/Function/ValidateToken";

/* src/hooks.server.js

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    //storing the userID in locasl so it is easy to access everywhere
    const token = event.cookies.get('token');
    const { valid, expired, decoded } = validateToken(token);
    console.log(decoded)
    if(decoded){
        event.locals.userID = decoded.userId
        event.locals.role = decoded.role
    }

    if(event.url.pathname.startsWith('/UI/UserManagement')  || event.url.pathname.startsWith('/UI/ViewAnalytics') ){
        if(decoded?.role !== 'A'){
            return new Response(
                JSON.stringify({ message: 'Unauthorized: Must be a Admin' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
    }
    if(event.url.pathname.startsWith('/UI/Moderation')) {
        if(decoded?.role === 'E' || !decoded){
            return new Response(
                JSON.stringify({ message: 'Unauthorized: Must be a Admin Or Moderator' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }
    }
    
   


    //check url 
    console.log(event.url.pathname)
    const apiPaths = ['/API/files', '/API/Tags', '/API/FileTags'];

    if(apiPaths.some(path => event.url.pathname.startsWith(path))){

        const token = event.cookies.get('token');
        const { valid, expired, decoded } = validateToken(token);
        console.log(decoded)

        if (event.request.method === 'POST'){

            if(!valid || expired){
                return new Response(
                    JSON.stringify({ message: 'Unauthorized: invalid or expired token' }),
                    { status: 401, headers: { 'Content-Type': 'application/json' } }
                ); 
            }
        }
        if(event.request.method === 'PUT'){
            if(!valid || expired){
                return new Response(
                    JSON.stringify({ message: 'Unauthorized: invalid or expired token' }),
                    { status: 401, headers: { 'Content-Type': 'application/json' } }
                ); 
            }
            if(decoded?.role === 'E'){
                return new Response(
                    JSON.stringify({ message: 'Unauthorized: Must be a Admin OR Moderator' }),
                    { status: 401, headers: { 'Content-Type': 'application/json' } }
                ); 
            }
        }

        if(event.request.method === 'DELETE'){
            if(!valid || expired){
                return new Response(
                    JSON.stringify({ message: 'Unauthorized: invalid or expired token cannot delete' }),
                    { status: 401, headers: { 'Content-Type': 'application/json' } }
                ); 
            }
        }
    }
    return await resolve(event);
}
  