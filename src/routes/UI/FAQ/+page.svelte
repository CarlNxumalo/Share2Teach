<script lang="ts">import { Section, Faq, FaqItem } from "flowbite-svelte-blocks";
</script>

<Section name="faq">
  <h2 class="mb-8 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Frequently asked questions</h2>
  <Faq>
    <div>
      <FaqItem>
        <svelte:fragment slot="h3">What is Share2Teach</svelte:fragment>
        <p class="text-gray-500 dark:text-gray-400">Share2Teach is an open educational resource (OER) platform where students and educators can share and access teaching materials across various subjects.</p>
      </FaqItem>
      <FaqItem>
        <svelte:fragment slot="h3">How can I contribute my own resources</svelte:fragment>
        <p class="text-gray-500 dark:text-gray-400">To contribute, you need to create an account. Once logged in, you can upload your resources through the 'Contribute' section accessible from the main menu.</p>
      </FaqItem>
      <FaqItem>
        <svelte:fragment slot="h3">Are all the resources free to use</svelte:fragment>
        <p class="text-gray-500 dark:text-gray-400">Yes, all resources on Share2Teach are free to use. .</p>
        <p class="text-gray-500 dark:text-gray-400">
          Feel free to <a href="/" class="font-medium underline text-primary-600 dark:text-primary-500 hover:no-underline" target="_blank" rel="noreferrer">contact us</a> and we'll help you out as soon as we can.
        </p>
      </FaqItem>
      <FaqItem>
        <svelte:fragment slot="h3">How do I search for specific resources</svelte:fragment>
        <p class="text-gray-500 dark:text-gray-400">You can use the search bar at the top of the page to look for resources by keywords, subjects, or tags. You can also browse resources by subject from the main menu.</p>
      </FaqItem>
    </div>
    <div>
      <FaqItem>
        <svelte:fragment slot="h3">Is Share2Teach affiliated with any educational institution</svelte:fragment>
        <p class="text-gray-500 dark:text-gray-400">
            Share2Teach is an initiative supported by North-West University, but it's an open platform for all educators and students regardless of their institutional affiliation. 
        </p>
      </FaqItem>
    </div>
  </Faq>
</Section>