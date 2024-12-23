<script>
    import { Input, Textarea, Button, Label } from 'flowbite-svelte';
    
    let name = '';
    let email = '';
    let subject = '';
    let message = '';
    let formMessage = '';
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Simulate sending a contact request (replace with real API call)
      if (name && email && subject && message) {
        formMessage = 'Your message has been sent successfully!';
        // Clear form fields after submission
        name = '';
        email = '';
        subject = '';
        message = '';
        // Call your backend API to handle the contact form submission here
      } else {
        formMessage = 'Please fill out all fields before submitting.';
      }
    };
  </script>
  
  <!-- Main container for contact form -->
  <div class="max-w-xl mx-auto p-6 space-y-6 sm:p-8">
    <h2 class="text-3xl font-semibold text-gray-900 dark:text-white">Contact Us</h2>
    <p class="text-gray-600 dark:text-gray-300">
      Have questions or inquiries? Fill out the form below, and we’ll get back to you as soon as possible.
    </p>
  
    <form class="space-y-6" on:submit={handleSubmit}>
      <Label>
        <span>Your Name</span>
        <Input type="text" bind:value={name} placeholder="John Doe" required />
      </Label>
  
      <Label>
        <span>Your Email</span>
        <Input type="email" bind:value={email} placeholder="name@company.com" required />
      </Label>
  
      <Label>
        <span>Subject</span>
        <Input type="text" bind:value={subject} placeholder="Subject of your message" required />
      </Label>
  
      <Label>
        <span>Message</span>
        <Textarea bind:value={message} placeholder="Write your message here" rows="5" required />
      </Label>
  
      {#if formMessage}
        <p class="text-sm {formMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'} dark:{formMessage.includes('successfully') ? 'text-green-400' : 'text-red-400'}">
          {formMessage}
        </p>
      {/if}
  
      <Button type="submit" class="w-full">Send Message</Button>
    </form>
  </div>
  
  <style>
    .max-w-xl {
      max-width: 36rem; /* Example width for a contact form */
    }
  </style>
  