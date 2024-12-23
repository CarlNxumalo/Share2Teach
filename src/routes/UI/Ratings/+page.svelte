<script>
    import { onMount } from 'svelte';
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch, Button, Dropdown, Radio, A, Heading } from 'flowbite-svelte';
    import { Section } from 'flowbite-svelte-blocks';
    import { PlusOutline, ChevronDownOutline} from 'flowbite-svelte-icons';
    import {  Modal } from 'flowbite-svelte';
    import { ExclamationCircleOutline } from 'flowbite-svelte-icons';

    let popupModal = false;
    export let data;
    var rating = 0; 
    var _fileID = 0;
    var group1 = ''

    async function selectedRow(fileID) {
        popupModal = true;
        _fileID = fileID

    }

    async function rateFile(){
        const ratingData = {
            rate: group1,      // Replace with actual rating value
            fileID: _fileID, // Replace with actual file ID
        };
        try {
            const response = await fetch('/API/ratings/'+_fileID, { // Replace with the actual API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ratingData }),
            });

            // Parse the JSON response
            const result = await response.json();

            if (response.ok) {
                // Handle success
                console.log(result.message);
                alert('Rating added successfully');
            } else {
                // Handle failure
                console.error(result.error);
                alert('Failed to add rating: ' + result.error);
            }
        } catch (error) {
            // Handle network or other errors
            console.error('Error:', error);
            alert('An error occurred while adding the rating.');
        }
    }

    async function AVGRate(fileID) {
      const response = await fetch(`/api/ratings/${fileID}`);
    }

    
</script>


  
  
  
  <Modal bind:open={popupModal} size="xs" autoclose>
    <div class="text-center">
        <Button>
            Select File Rate{group1}<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" />
          </Button>
          <Dropdown class="w-44 p-3 space-y-3 text-sm">
            <li>
              <Radio name="group1" bind:group={group1} value={1}>Rate 1</Radio>
            </li>
            <li>
              <Radio name="group1" bind:group={group1} value={2}>Rate 2</Radio>
            </li>
            <li>
              <Radio name="group1" bind:group={group1} value={3}>Rate 3</Radio>
            </li>
            <li>
                <Radio name="group1" bind:group={group1} value={4}>Rate 4</Radio>
            </li>
            <li>
                <Radio name="group1" bind:group={group1} value={5}>Rate 5</Radio>
            </li>
          </Dropdown>
      <Button color="red" class="me-2" on:click={() => rateFile()}>Yes, I'm sure</Button>
    </div>
  </Modal>



<Section name="advancedTable" classSection='bg-gray-50 dark:bg-gray-900 p-3 sm:p-5'>
    <Heading tag="h3">File Rating</Heading>
    <TableSearch placeholder="Search" hoverable={true}  >

    <div slot="header" class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
    </div>
      <TableHead>
        <TableHeadCell padding="px-4 py-3" scope="col">File Name</TableHeadCell>
      </TableHead>
      <TableBody tableBodyClass="divide-y">
        {#each data?.Files as file, i}            
            <TableBodyRow slot="row" on:click={() => selectedRow(file.FileID)}>
              <TableBodyCell><A href="https://share2teachfileserver.blob.core.windows.net/files/{file.Path}">{file.Path}</A></TableBodyCell>
              
            </TableBodyRow>
        {/each}

      </TableBody>
    </TableSearch>
</Section>