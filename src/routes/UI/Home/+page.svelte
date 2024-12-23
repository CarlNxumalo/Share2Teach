
<script>
  import { onMount } from 'svelte';
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch, Button, Dropdown, DropdownItem, Checkbox, ButtonGroup, Select, Radio,MultiSelect, A } from 'flowbite-svelte';
  import { Section } from 'flowbite-svelte-blocks';
  import { PlusOutline, ChevronDownOutline, FilterSolid, ChevronRightOutline, ChevronLeftOutline } from 'flowbite-svelte-icons';
  import {Label, Input } from 'flowbite-svelte';
  
  let group1 = '';
 let group2 ='';
 let group3 = '';

  export let data;
  
  let searchTerm = ''; 
  let files = data?.Files;

  import {  Modal } from 'flowbite-svelte';
  let formModal = false;
  let formModal2 = false;
  let selectedFile = null;
  let selectedSubjectBe = 0;

  import { Fileupload} from 'flowbite-svelte';
	import { enhance } from '$app/forms';
  let fileValue;

  /**
	 * @type {any[]}
	 */
  let selected = [];
  let convertedStages = data?.Tags.map(stage => ({
    value: stage.tagID,
    name: stage.name
  }));


  //table related stuff
  let divClass='bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden';
  let innerDivClass='flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4';
  let searchClass='w-full md:w-1/2 relative';
  let svgDivClass='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none';
  let classInput="text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2  pl-10"

  //submit form
  async function handleFileUpload(event){
    event.preventDefault(); // Prevent default form submission

    // Access form data from the event
    const formData = new FormData(event.target); // 'event.target' refers to the form element
    console.log("Hello carl: "+formData.get("subjectID"))
    // Log the form data to verify inputs
    for (const [key, value] of formData.entries()) {
      console.log(key, value); // Logs all form inputs (file, text, hidden fields, etc.)
    }

    const response = await fetch('/API/files', {
      method: 'POST',
      body: formData,
    });

    // Handle the API response (success/failure)
    if(response.ok){
      alert("File succesffully uploaded")
      form
    }
    else{
      alert(
        "File was not uploaded successfully"
      )
    }
  }

  async function selectedRow(fileID) {
    selectedFile = fileID;
    formModal2 = true;
  }

  async function taggingTheFile(fileID) {
    try {
      selected.forEach(async (Tagging) => {
           //Outputs each country
           await tagFile(fileID, Tagging)
      });
      alert("Tagged file succesfully")
      formModal2 = false
    } catch (error) {
      console.log(error)
      alert("Tagged file unsuccesfully")
    }
  }

  async function selectedSubject(subjectID) {
      selectedSubjectBe = subjectID
  }

  async function tagFile(fileID, tagID) {
    try {
        const response = await fetch('/API/FileTags', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileID, tagID }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
        } else {
            const data = await response.json();
            console.log('Success:', data.message);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
  }


  async function searchDoc(){
      const response = await fetch(`/API/files?FileName=${searchTerm}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error('Failed to fetch files');
      }
      files = await response.json(); // Store the result in a variable
  }
  async function searchByTag(tag){
      const response = await fetch(`/API/files?TagID=${tag}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error('Failed to fetch files by tags');
      }
      files = await response.json(); // Store the result in a variable
  }

  async function searchBySubject(subjectID) {
    const response = await fetch(`/API/files?SubjectID=${subjectID}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error('Failed to fetch files by subject');
      }
      files = await response.json();
  }
      

</script>

<Section name="advancedTable" classSection='bg-gray-50 dark:bg-gray-900 p-3 sm:p-5'>
    <TableSearch placeholder="Search" hoverable={true} bind:inputValue={searchTerm} {divClass} {innerDivClass} {searchClass} >

    <div slot="header" class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
      <Button on:click={searchDoc}>Search</Button>
      <Button>
        Tag {group1}<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" />
      </Button>
      <Dropdown class="w-44 p-3 space-y-3 text-sm">
        {#each data?.Tags as Tag}
          <li>
            <Radio name="group1" bind:group={group1} value={Tag.name} on:click={() => searchByTag(Tag.tagID)} >{Tag.name}</Radio>
          </li>
        {/each}
      </Dropdown>
      {#if data.role}
        <Button on:click={() => (formModal = true)}><PlusOutline class="h-3.5 w-3.5 mr-2" />Add File</Button>
      {/if}
      
      
      <Button>
        Subject {group2}<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" />
      </Button>
      <Dropdown class="w-44 p-3 space-y-3 text-sm">
        {#each data?.Subjects as subject}
          <li>
            <Radio name="group2" bind:group={group2} value={subject._name} on:click={() => searchBySubject(subject._subjectID)} >{subject._name}</Radio>
          </li>
        {/each}
      </Dropdown>

    </div>
      <TableHead>
        <TableHeadCell padding="px-4 py-3" scope="col">File Name</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Type</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Status</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Report</TableHeadCell>
      </TableHead>
      <TableBody tableBodyClass="divide-y">
        {#each files as file, i}            
            <TableBodyRow slot="row" on:click={() => selectedRow(file.FileID)}>
              <TableBodyCell><A href="https://share2teachfileserver.blob.core.windows.net/files/{file.Path}">{file.Path}</A></TableBodyCell>
              <TableBodyCell>{file.Type}</TableBodyCell>
              <TableBodyCell>{file.Status}</TableBodyCell>
              <TableBodyCell>{file.Report}</TableBodyCell>
            </TableBodyRow>
        {/each}

      </TableBody>
    </TableSearch>
</Section>



<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
  <form class="flex flex-col space-y-6"  on:submit={handleFileUpload}  action="#">
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h3>
    <Label class="space-y-2">
      <span>File Name</span>
      <Input type="text" name="path"  required />
    </Label>
    <Button>
      Subject {group1}<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" />
    </Button>
    <Dropdown class="w-44 p-3 space-y-3 text-sm" >
      {#each data?.Subjects as subject }
        <li>
           <Radio name="group3" bind:group={group3} value={subject._name} on:click={() => selectedSubject(subject._subjectID)} >{subject._name}</Radio>
        </li>
      {/each}
    </Dropdown>
    <input type="hidden" name="subjectID" bind:value={selectedSubjectBe}/>
    <Label class="space-y-2 mb-2">
      <span>Upload file</span>
      <Fileupload bind:fileValue  name="documents"/>
    </Label>
    <input type="hidden" name="grade" value="10" />
    <Button type="submit" class="w-full1">Submit File</Button>
  </form>
</Modal>





<Modal bind:open={formModal2} size="sm" autoclose={false} class="w-full">
  <form class="flex flex-col space-y-6" action="#">
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add Tags To A File{selectedFile}</h3>
    <MultiSelect items={convertedStages} bind:value={selected}></MultiSelect>
    <Button type="submit" class="w-full1"  on:click={() => taggingTheFile(selectedFile)}>Add Tag\s</Button>
  </form>
</Modal>