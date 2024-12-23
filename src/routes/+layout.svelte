
<script >
  import { Section } from 'flowbite-svelte-blocks';
  import { Footer, FooterBrand, FooterLinkGroup, FooterLink, FooterCopyright, FooterIcon } from 'flowbite-svelte';

  export let data;

  import '../app.css';
  import { onMount } from 'svelte';
  import { ChevronDownOutline } from 'flowbite-svelte-icons';
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Dropdown, DropdownItem, DropdownDivider, Avatar, DropdownHeader } from 'flowbite-svelte';
  import { goto } from '$app/navigation'; // Import for navigation without reload

  let isAuthenticated = false;

  let activeClass = 'text-white bg-green-700 md:bg-transparent md:text-green-700 md:dark:text-white dark:bg-green-600 md:dark:bg-transparent';
  let nonActiveClass = 'text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent';


  console.log(data.role)
  

  function handleSignOut() {
    document.cookie = 'token=; Max-Age=0; path=/;';
    window.location.reload(); // Full page reload after sign out, or use goto('/') for navigation
    goto('/');
  }
</script>

<Navbar>
  <NavBrand href="/">
    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Share2Teach</span>
  </NavBrand>

  <!-- Conditionally show avatar and dropdown menu if the user is authenticated -->
  {#if data.role}
    <div class="flex items-center md:order-2">
      <Avatar id="avatar-menu" alt="User Profile" />

      <Dropdown placement="bottom" triggeredBy="#avatar-menu">
        <DropdownDivider />
        <DropdownItem on:click={handleSignOut}>Sign out</DropdownItem>
      </Dropdown>

      <!-- Hamburger menu for mobile -->
      <NavHamburger class="w-full md:hidden" />
    </div>
  {/if}

  <!-- Navbar Links for desktop and mobile -->
  <NavUl {activeClass} {nonActiveClass} class="md:flex md:items-center md:order-1">
    <NavLi href="/UI/Home">Home</NavLi>
    <NavLi href="/UI/Ratings">Ratings</NavLi>
    <NavLi href="/UI/AboutUs">About Us</NavLi>
    <NavLi href="/UI/FAQ">FAQ</NavLi>
    {#if !data.role}
      <NavLi href="/UI/SignUp">Sign Up</NavLi>
      <NavLi href="/UI/SignIn">Sign In</NavLi>
    {/if}
    {#if data.role === 'A'}
      <NavLi href="/UI/UserManagement">User Management</NavLi>
      <NavLi href="/UI/Moderation">File Moderation</NavLi>
      <NavLi href="/UI/ViewAnalytics">Analytics</NavLi>
    {/if}
    {#if data.role === 'M'}
      <NavLi href="/UI/Moderation">File Moderation</NavLi>
    {/if}

  </NavUl>
</Navbar>





<slot></slot>



<Footer footerType="socialmedia">
  <div class="mx-auto max-w-screen-xl text-center">
   
    <p class="my-6 text-gray-500 dark:text-gray-400">Share2Teach</p>
    <FooterLinkGroup ulClass="flex flex-wrap justify-center items-center mb-6 text-gray-900 dark:text-white">
      <FooterLink liClass="" aClass="mr-4 hover:underline md:mr-6" href="/UI/Home">Home</FooterLink>
      <FooterLink liClass="" aClass="mr-4 hover:underline md:mr-6" href="/UI/AboutUs">About Us</FooterLink>
      <FooterLink liClass="" aClass="mr-4 hover:underline md:mr-6" href="/UI/FAQ">FAQs</FooterLink>
    </FooterLinkGroup>
    <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 All Rights Reserved.</span>
  </div>
</Footer>
