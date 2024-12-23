<script lang="ts">
    import { Section, Register } from "flowbite-svelte-blocks";
    import { Button, Checkbox, Label, Input } from "flowbite-svelte";
    import { goto } from '$app/navigation';
    

    let email = '';
    let password = '';
    let errorMessage = '';
    let isAuthenticated = false;

    async function handleSignIn(event) {
    event.preventDefault(); // Prevent default form submission behavior
    try {
        const response = await fetch('/API/SignIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

            const result = await response.json();

            if (response.ok) {
                goto('/UI/Home'); // Redirect to home or another page
            } else {
                // Show error message from the API response
                errorMessage = result.message || 'Failed to sign in.';
                console.error('Sign-in error:', errorMessage); // Log the error message for debugging
            }
        } catch (error) {
            errorMessage = 'An error occurred while signing in.';
            console.error('Network error:', error); // Log the network error
        }
    }

    
</script>

<Section name="login">
    <Register href="/">
        <svelte:fragment slot="top">
            Share2Teach
        </svelte:fragment>
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <form class="flex flex-col space-y-6" on:submit={handleSignIn}>
                <h3 class="text-xl font-medium text-gray-900 dark:text-white">Sign In</h3>
                
                <Label class="space-y-2">
                    <span>Your email</span>
                    <Input type="email" name="email" placeholder="name@company.com" bind:value={email} required />
                </Label>
                
                <Label class="space-y-2">
                    <span>Your password</span>
                    <Input type="password" name="password" placeholder="•••••" bind:value={password} required />
                </Label>
                
                <div class="flex items-start">
            
                    <a href="/UI/ResetPassword" class="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500">Forgot password?</a>
                </div>
                
                <Button type="submit" class="w-full">Sign in</Button>
                
                {#if errorMessage}
                    <p class="text-red-500">{errorMessage}</p>
                {/if}

                <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                    Don’t have an account yet? 
                    <a href="/UI/SignUp" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                </p>
            </form>
        </div>
    </Register>
</Section>
