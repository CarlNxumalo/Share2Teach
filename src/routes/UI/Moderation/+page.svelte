<script lang="ts">
	import { onMount } from 'svelte';
	import {Label, Input } from 'flowbite-svelte';
	import { Section } from 'flowbite-svelte-blocks';
	import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch, Button, Dropdown, DropdownItem, Checkbox, ButtonGroup, Select, Textarea } from 'flowbite-svelte';
	import { PlusOutline, ChevronDownOutline, FilterSolid, ChevronRightOutline, ChevronLeftOutline } from 'flowbite-svelte-icons';
	import {  Modal } from 'flowbite-svelte';
  	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
  let popupModal = false;
  let formModal = false;

	let formReport =''
	let formID=0;
	let formStatus=''
	let userReport = ''

	let files = []; // Holds the list of pending files
	let errorMessage = ''; // For error handling
	let loading = true; // Loading state
	let moderationSuccess = ''; // Success message
    let searchTerm = ''
	// Fetch pending files
	async function fetchFiles() {
	  try {
		
		const res = await fetch('/API/files');
		if (res.ok) {
		  files = await res.json(); // Populate the files array
		  console.log(files)
		} else {
		  errorMessage = 'Failed to fetch files for moderation.';
		  popupModal = true;
		}
	  } catch (error) {
		console.error('Error fetching files:', error);
		errorMessage = 'Failed to fetch files for moderation.';
		popupModal = true;

	  } finally {
		loading = false; // Stop loading spinner
	  }
	}
  
	// Approve or Reject a File
	async function moderateFile(fileId, status, report) {
	  try {
		
		const res = await fetch(`/API/files/${fileId}`, {
		  method: 'PUT',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify({ status, report }), // Pass the status and report data
		});
  
		if (res.ok) {
		  moderationSuccess = `File ${fileId} ${status === 'approved' ? 'approved' : 'rejected'} successfully!`;
		  fetchFiles(); // Refresh the list of files after moderation
		  popupModal = true;
		} else {
		  errorMessage = 'Failed to update file status.';
		  popupModal = true;
		}
	  } catch (error) {
		console.error('Error updating file:', error);
		errorMessage = 'Internal Server Error';
		popupModal = true;
	  }
	}

	// Delete a file
	async function deleteFile(fileId) {
	  try {
		
		const res = await fetch(`/API/files/${fileId}`, { method: 'DELETE' });
		if (res.ok) {
		  moderationSuccess = `File ${fileId} deleted successfully!`;
		  fetchFiles(); // Refresh the list of files after deletion
		} else {
		  errorMessage = 'Failed to delete the file.';
		  popupModal = true;
		}
	  } catch (error) {
		console.error('Error deleting file:', error);
		errorMessage = 'Internal Server Error';
		popupModal = true;
	  }
	}

	async function reportAFile(fileID,status) {

		formID = fileID;
		formStatus = status;
		formModal = true;
		
	}
	async function saveReport(fileID, report, status) {
		try {
			
			const response = await fetch(`/API/files/${fileID}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ status, report }) // Convert the file data to JSON
			});

			// Check if the request was successful
			if (response.ok) {
				const result = await response.json();
				console.log(result.message); // Log success message to the console
				alert("File reported successfully")
				formModal = false;
				fetchFiles();
			} else {
				const error = await response.json();
				console.error('Error updating file:', error.error);
				alert("File report was  unsuccessfully")
				return error;
			}
		} catch (error) {
			console.error('Network error updating file:', error);
			return { error: 'Failed to update file due to network error' };
		}
	}

	
  
	// On component mount, fetch the files
	onMount(() => {
		fetchFiles();
	});



	//table related stuff
	let divClass='bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden';
	let innerDivClass='flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4';
	let searchClass='w-full md:w-1/2 relative';
	let svgDivClass='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none';
	let classInput="text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2  pl-10"
  </script>
  
  <main class="container mx-auto py-10 px-4 ">
	<h1 class="text-3xl font-bold text-gray-900 mb-6">File Moderation</h1>
	
		<TableSearch placeholder="Search" hoverable={true} bind:inputValue={searchTerm} {divClass} {innerDivClass} {searchClass} {classInput}> 
	
		<div slot="header" class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
		  
		</div>
		  <TableHead>
			<TableHeadCell padding="px-4 py-3" scope="col">File Name</TableHeadCell>
			<TableHeadCell padding="px-4 py-3" scope="col">Report</TableHeadCell>
			<TableHeadCell padding="px-4 py-3" scope="col">Status</TableHeadCell>
			<TableHeadCell padding="px-4 py-3" scope="col">Approval</TableHeadCell>
			<TableHeadCell padding="px-4 py-3" scope="col">Rejection</TableHeadCell>
			<TableHeadCell padding="px-4 py-3" scope="col">Deletion</TableHeadCell>
			<TableHeadCell padding="px-4 py-3" scope="col">Reporting</TableHeadCell>
		  </TableHead>
		  <TableBody tableBodyClass="divide-y">
			{#each files as file, i}            
				<TableBodyRow slot="row" >
				  <TableBodyCell>{file.Path}</TableBodyCell>
				  <TableBodyCell><p class="limited-text">{file.Report}</p></TableBodyCell>
				  <TableBodyCell>{file.Status}</TableBodyCell>
				  <TableBodyCell>
					<Button
					class="bg-green-600 text-white hover:bg-green-700"
					on:click={() => moderateFile(file.FileID, 'approved', file.Report)}
					  >Approve
				  </Button>
				  </TableBodyCell>
				  <TableBodyCell>
					<Button
					class="bg-red-600 text-white hover:bg-red-700"
					on:click={() => moderateFile(file.FileID, 'disapproved', file.Report)}
					  >Reject
				  </Button>
				  </TableBodyCell>
				  <TableBodyCell>
					<!-- Delete Button -->
					<Button
					class="bg-gray-600 text-white hover:bg-gray-700"
					on:click={() => deleteFile(file.FileID)}
					  >Delete
				  </Button>
				  </TableBodyCell>
				  <TableBodyCell>
					<Button
					class="bg-red-600 text-white hover:bg-red-700"
					on:click={() => reportAFile(file.FileID,file.Status)}
					  >Report
				  </Button>
				</TableBodyCell>
				</TableBodyRow>
			{/each}
		  </TableBody>
		</TableSearch>
	
  </main>
  
	{#if errorMessage}
	  <Modal bind:open={popupModal} size="xs" autoclose>
		<div class="text-center">
		  <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
		  <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Sorry an Error occured: ${errorMessage}</h3>
		  <Button color="red" class="me-2">OK</Button>
		</div>
	  </Modal>
	{/if}

	{#if moderationSuccess}
		<Modal bind:open={popupModal} size="xs" autoclose>
		<div class="text-center">
		  <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
		  <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">You have successfully moderated the file!</h3>
		  <Button color="green" class="me-2">OK</Button>
		</div>
	  </Modal>
	{/if}
  
  
	<!-- Files List -->
	
	 



  


<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6" action="#">
	  <Textarea id="textarea-id" placeholder="Type report here" rows="4" name="message" bind:value={userReport} />
	  
	  <Button type="submit" class="w-full1" on:click={() => saveReport(formID, userReport, formStatus)}>Save Report</Button>
	  
	</form>
  </Modal>

  

  <style>
	.limited-text {
		display: -webkit-box;
		-webkit-line-clamp: 1; /* Limits text to 5 lines */
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>