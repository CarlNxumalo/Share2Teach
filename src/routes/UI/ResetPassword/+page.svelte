<script lang="ts">
  import { Section, Register } from "flowbite-svelte-blocks";
  import { Button, Label, Input } from "flowbite-svelte";
  import { goto } from '$app/navigation'; // For page navigation

  let email = '';
  let password = '';
  let confirmPassword = '';
  let emailError = '';
  let passwordError = '';
  let formError = '';
  let isProcessing = false;
  let emailExists = false; // To track if the email exists
  let emailCheckError = ''; // To handle email verification errors
  let showPassword = false; // To toggle password visibility

  async function verifyEmail() { 
    try {
        const response = await fetch(`/API/User/Email/${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            emailExists = data.exists; // Set to true if email exists
            emailCheckError = ''; // Clear any previous error messages
        } else if (response.status === 404) {
            emailExists = false; // Email does not exist
            emailCheckError = 'Email does not exist.';
        } else {
            throw new Error('Internal Server Error'); // Handle other errors
        }
    } catch (error) {
        emailCheckError = error.message; // Set the error message to be displayed
    }
}

async function updatePassword() {
    // Check if the password meets the minimum length requirement
    if (password.length < 8) {
        formError = 'Password must be at least 8 characters long.';
        return;
    }

    try {
        const response = await fetch('/API/User/Email', {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
                email, 
                newPassword: password, 
                confirmPassword 
            }) // Ensure JSON.stringify is used here
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || 'Failed to update password');
        }

        alert('Password updated successfully!');
        goto('/'); // Redirect to homepage
    } catch (error) {
        formError = error.message; // Set the error message to be displayed
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    // Clear previous errors
    emailError = '';
    passwordError = '';
    formError = '';
    emailCheckError = ''; // Clear previous email check errors

    // Basic validation
    if (!email) {
        emailError = 'Email is required';
        return;
    }

    // Verify if the email exists only if it has been changed
    await verifyEmail();

    if (!emailExists) {
        emailCheckError = 'Email does not exist. Cannot reset password.';
        return;
    }

    if (password !== confirmPassword) {
        passwordError = 'Passwords do not match';
        return;
    }

    // Update the password
    isProcessing = true; // Set processing state
    await updatePassword(); // Call the update password function
    isProcessing = false; // Reset processing state
}
</script>

<Section name="reset">
  <Register href="/">
    <svelte:fragment slot="top">
      Flowbite
    </svelte:fragment>
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <form class="flex flex-col space-y-6" on:submit={handleSubmit}>
        <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Change Password</h3>

        <!-- Email Input -->
        <Label class="space-y-2">
          <span>Your email</span>
          <Input type="email" bind:value={email} name="email" placeholder="name@company.com" required />
          {#if emailError}<p class="text-red-500 text-sm">{emailError}</p>{/if}
          {#if emailCheckError}<p class="text-red-500 text-sm">{emailCheckError}</p>{/if}
        </Label>

        <!-- Password Input -->
        <Label class="space-y-2 relative">
          <span>Your password</span>
          <Input type={showPassword ? 'text' : 'password'} bind:value={password} name="password" placeholder="•••••" required />
          <button type="button" class="absolute inset-y-0 right-0 flex items-center pr-3" on:click={() => showPassword = !showPassword} aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {#if showPassword}
              <span class="material-icons">visibility</span>
            {:else}
              <span class="material-icons">visibility_off</span>
            {/if}
          </button>
        </Label>

        <!-- Confirm Password Input -->
        <Label class="space-y-2 relative">
          <span>Confirm password</span>
          <Input type={showPassword ? 'text' : 'password'} bind:value={confirmPassword} name="confirm-password" placeholder="•••••" required />
          <button type="button" class="absolute inset-y-0 right-0 flex items-center pr-3" on:click={() => showPassword = !showPassword} aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {#if showPassword}
              <span class="material-icons">visibility</span>
            {:else}
              <span class="material-icons">visibility_off</span>
            {/if}
          </button>
          {#if passwordError}<p class="text-red-500 text-sm">{passwordError}</p>{/if}
        </Label>

        <!-- Form Error Display -->
        {#if formError}
          <p class="text-red-500 text-sm">{formError}</p>
        {/if}

        <!-- Submit Button -->
        <Button type="submit" class="w-full" disabled={isProcessing}>
          {#if isProcessing}
            Resetting...
          {:else}
            Reset password
          {/if}
        </Button>
      </form>
    </div>
  </Register>
</Section>
