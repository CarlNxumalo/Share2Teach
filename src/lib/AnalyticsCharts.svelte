<!-- src/lib/AnalyticsCharts.svelte -->
<script>
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';

  // Register chart.js components
  Chart.register(...registerables);

  export let dates = [];
  export let sessions = [];
  export let engagementRates = [];
  export let activeUsers = [];
  export let eventCounts = [];

  let sessionChart;
  let engagementChart;
  let activeUsersChart;
  let eventCountChart;

  onMount(() => {
    const sessionCtx = document.getElementById('sessionChart').getContext('2d');
    const engagementCtx = document.getElementById('engagementChart').getContext('2d');
    const activeUsersCtx = document.getElementById('activeUsersChart').getContext('2d');
    const eventCountCtx = document.getElementById('eventCountChart').getContext('2d');

    sessionChart = new Chart(sessionCtx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Sessions',
          data: sessions,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        }],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Number of Sessions',
            },
          },
        },
      },
    });

    engagementChart = new Chart(engagementCtx, {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [{
          label: 'Engagement Rate (%)',
          data: engagementRates,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        }],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Engagement Rate (%)',
            },
          },
        },
      },
    });

    activeUsersChart = new Chart(activeUsersCtx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Active Users',
          data: activeUsers,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
        }],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Number of Active Users',
            },
          },
        },
      },
    });

    eventCountChart = new Chart(eventCountCtx, {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [{
          label: 'Event Count',
          data: eventCounts,
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
        }],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Event Count',
            },
          },
        },
      },
    });

    return () => {
      // Cleanup chart instances on component destroy
      sessionChart.destroy();
      engagementChart.destroy();
      activeUsersChart.destroy();
      eventCountChart.destroy();
    };
  });
</script>

<canvas id="sessionChart" width="400" height="200"></canvas>
<canvas id="engagementChart" width="400" height="200"></canvas>
<canvas id="activeUsersChart" width="400" height="200"></canvas>
<canvas id="eventCountChart" width="400" height="200"></canvas>

<style>
  canvas {
    max-width: 100%;
    margin-bottom: 2rem;
  }
</style>
