<script lang="ts">import { Section, Register } from "flowbite-svelte-blocks";
  import { Button, Checkbox, Label, Input ,Select,Radio, Helper, A } from "flowbite-svelte";
  import { ChevronDownOutline } from 'flowbite-svelte-icons';
  import { goto } from '$app/navigation';
 

  

  let gender = 'F';
  let role='';
  let fName = '';
  let lName = '';
  let email = '';
  let password = '';
  let errorMessage = '';
  let roles = [
    { value: 'A', name: 'Admin' },
    { value: 'M', name: 'Moderator' },
    { value: 'E', name: 'Educator' }
  ];

   


    async function handleSignUP(event) {
      const currentDate = new Date();
        const timeStamp = currentDate.toISOString().slice(0, 19).replace('T', ' '); // Format to YYYY-MM-DD HH:MM:SS
        try {
            // Make a POST request to the sign-in API
            const response = await fetch('/API/User', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({fName,lName, password,email,gender,role,createdAt: currentDate,updatedAt:currentDate }) // Send the email and password in the body
            });
        
            const result = await response.json();
            

            if (response.ok) {
                goto('/'); // Redirect after logging activity
                alert("done");  
            
          }
          
        } 
        catch (error) {
            errorMessage = 'An error occurred while signing up.';
        }
    }
  
    

    </script>
    
    <Section name="register">
      <Register href="/">
        <svelte:fragment slot="top">
          Share2Teach
        </svelte:fragment>
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <form class="flex flex-col space-y-6" action="/" on:submit={handleSignUP}>
            <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Create and account</h3>
            <Label for="first_name" class="mb-2">First name</Label>
            <Input type="text" id="first_name" placeholder="Donald" bind:value={fName} required />

            <Label for="last_name" class="mb-2">Last name</Label>
            <Input type="text" id="last_name" placeholder="Duck" bind:value={lName} required />


            <Label class="space-y-2">
              <span>Your email</span>
              <Input type="email" name="email" placeholder="name@gmail.com" bind:value={email}  required />
            </Label>
            <Label class="space-y-2">
              <span>Your password</span>
              <Input type="password" name="password" placeholder="•••••"  bind:value={password} required />
            </Label>
            <Label>Select gender</Label>
            <div class="flex gap-3">
                <Radio bind:group={gender} value="M"  >Male</Radio>
                <Radio bind:group={gender} value="F">Female</Radio>
              </div>
            <Label>
                Select Role
                <Select class="mt-2" items={roles} bind:value={role} />
              </Label>
            <Button type="submit" class="w-full1">Create an account</Button>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
              Already have an account? <a href="/" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a>
            </div>
          </form>
        </div>
      </Register>
    </Section>

   