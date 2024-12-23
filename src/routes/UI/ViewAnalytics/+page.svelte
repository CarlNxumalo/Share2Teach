<script>
  import { onMount } from 'svelte';
  import AnalyticsChart from '../../../lib/AnalyticsCharts.svelte';

  let data = {
    rows: [],
  };

  let sessions = [];
  let engagementRates = [];
  let activeUsers = [];
  let eventCounts = [];
  let dates = [];

  // Fetch analytics data from the API
  onMount(async () => {
    try {
      const response = await fetch('/API/analytics');
      const jsonData = await response.json();

      // Check if the response contains rows
      if (jsonData.rows) {
        data = jsonData;

        // Extract data from the API response
        sessions = data.rows.map(row => parseInt(row.metricValues[0].value));
        engagementRates = data.rows.map(row => parseFloat(row.metricValues[1].value) * 100); // Convert to percentage
        activeUsers = data.rows.map(row => parseInt(row.metricValues[2].value));
        eventCounts = data.rows.map(row => parseInt(row.metricValues[3].value));
        dates = data.rows.map(row => row.dimensionValues[0].value);

        // Log data for debugging
        console.log({
          sessions,
          engagementRates,
          activeUsers,
          eventCounts,
          dates
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });
</script>

<style>
  table {
    @apply w-full border-collapse;
  }
  th, td {
    @apply border px-4 py-2 text-left;
  }
  th {
    @apply bg-gray-200 font-semibold;
  }
</style>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Analytics Dashboard</h1>
  
  <table class="mt-4">
    <thead>
      <tr>
        <th>Date</th>
        <th>Sessions</th>
        <th>Engagement Rate (%)</th>
        <th>Active Users</th>
        <th>Event Count</th>
      </tr>
    </thead>
    <tbody>
      {#each dates as date, index}
        <tr>
          <td>{date}</td>
          <td>{sessions[index]}</td>
          <td>{engagementRates[index]?.toFixed(2) || 0}</td> <!-- Safely access engagementRates -->
          <td>{activeUsers[index]}</td>
          <td>{eventCounts[index]}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  <!-- Conditional Rendering for Charts -->
  {#if sessions.length > 0 && engagementRates.length > 0}
    <div class="mt-8">
      <h2 class="text-xl font-bold mb-4">Charts</h2>
      <AnalyticsChart {dates} {sessions} {engagementRates} {activeUsers} {eventCounts} />
    </div>
  {:else}
    <p>No data available for charts.</p> <!-- Optional: message when no data -->
  {/if}
</div>
