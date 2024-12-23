<script lang="ts">
    import { onMount } from 'svelte';
    import { Button, Modal, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte';
    import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
  
    let popupModal = false; // For error/success messages
    let updateModal = false; // For the update user form
    let users = []; // Holds the list of users
    let errorMessage = ''; // For error handling
    let loading = true; // Loading state
    let moderationSuccess = ''; // Success message
    let searchTerm = '';
    let selectedUser = null; // For user editing
    let updatedAccessLevel = ''; // For storing the updated access level
  
    // Fetch users
    async function fetchUsers() {
      try {
        const res = await fetch('/API/User');
        if (res.ok) {
          users = await res.json(); // Populate the users array
          console.log(users);
        } else {
          errorMessage = 'Failed to fetch users.';
          popupModal = true;
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        errorMessage = 'Failed to fetch users.';
        popupModal = true;
      } finally {
        loading = false; // Stop loading spinner
      }
    }
  
  async function updateUser(userId) {
    try {
      console.log(`Updating user ${userId} with role ${updatedAccessLevel}`);
      const res = await fetch(`/API/User/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: updatedAccessLevel }),
      });
  
      if (res.ok) {
        moderationSuccess = `User ${userId} updated successfully!`;
        fetchUsers(); // Refresh the list of users after updating
        updateModal = false; // Close the update modal
        popupModal = true; // Show success message
      } else {
        const errorData = await res.json(); // Log error details from API response
        console.error('Update failed:', errorData);
        errorMessage = `Failed to update user: ${errorData.message || 'Unknown error'}`;
        popupModal = true;
      }
    } catch (error) {
      console.error('Error updating user:', error);
      errorMessage = 'Internal Server Error';
      popupModal = true;
    }
  }
  
  
    // Delete a user
    async function deleteUser(userId) {
      try {
        const res = await fetch(`/API/User/${userId}`, { method: 'DELETE' });
        if (res.ok) {
          moderationSuccess = `User ${userId} deleted successfully!`;
          fetchUsers(); // Refresh the list of users after deletion
        } else {
          errorMessage = 'Failed to delete the user.';
          popupModal = true;
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        errorMessage = 'Internal Server Error';
        popupModal = true;
      }
    }
  
    // Open update modal and populate fields
    function openUpdateModal(user) {
      selectedUser = user;
      updatedAccessLevel = user.role; // Set initial access level
      updateModal = true; // Open update modal
    }
  
    // On component mount, fetch the users
    onMount(() => {
      fetchUsers();
    });
  </script>
  
  <main class="container mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">User Management</h1>
  
    {#if errorMessage}
      <Modal bind:open={popupModal} size="xs" autoclose>
        <div class="text-center">
          <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
          <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Sorry, an error occurred: {errorMessage}</h3>
          <Button color="red" on:click={() => (popupModal = false)}>OK</Button>
        </div>
      </Modal>
    {/if}
  
    {#if moderationSuccess}
      <Modal bind:open={popupModal} size="xs" autoclose>
        <div class="text-center">
          <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
          <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{moderationSuccess}</h3>
          <Button color="green" on:click={() => (popupModal = false)}>OK</Button>
        </div>
      </Modal>
    {/if}
  
    <!-- Update User Modal -->
    <Modal bind:open={updateModal} size="md">
      <div class="text-center">
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Update User Access Level</h3>
        <form on:submit|preventDefault={() => updateUser(selectedUser.userID)}>
          <label for="userId" class="block mb-2">User ID:</label>
          <input type="text" id="userId" value={selectedUser?.userID} readonly class="mb-4 w-full p-2 border border-gray-300 rounded"/>
          
          <label for="accessLevel" class="block mb-2">Access Level:</label>
          <select id="accessLevel" bind:value={updatedAccessLevel} class="mb-4 w-full p-2 border border-gray-300 rounded">
            <option value="A">Admin</option>
            <option value="E">Educator</option>
            <option value="M">Moderator</option>
          </select>
          
          <Button color="blue" type="submit">Update</Button>
          <Button color="gray" on:click={() => (updateModal = false)}>Cancel</Button>
        </form>
      </div>
    </Modal>
  
    <!-- Users List -->
    <TableSearch placeholder="Search" bind:inputValue={searchTerm}>
      <TableHead>
        <TableHeadCell>User ID</TableHeadCell>
        <TableHeadCell>First Name</TableHeadCell>
        <TableHeadCell>Last Name</TableHeadCell>
        <TableHeadCell>Email</TableHeadCell>
        <TableHeadCell>Role</TableHeadCell>
        <TableHeadCell>Actions</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each users as user}
          <TableBodyRow>
            <TableBodyCell>{user.userID}</TableBodyCell>
            <TableBodyCell>{user.fName}</TableBodyCell>
            <TableBodyCell>{user.lName}</TableBodyCell>
            <TableBodyCell>{user.email}</TableBodyCell>
            <TableBodyCell>{user.role}</TableBodyCell>
            <TableBodyCell>
              <Button on:click={() => openUpdateModal(user)}>Update</Button>
              <Button on:click={() => deleteUser(user.userID)}>Delete</Button>
            </TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </TableSearch>
  </main>
  