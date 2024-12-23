// src/routes/api/analytics/+server.js
import { google } from 'googleapis';
import { json } from '@sveltejs/kit';
import { KEY } from '$env/static/private';

export async function GET() {
  // Load the service account key file
  const keyFile = KEY;

  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });

  // Get an authenticated client
  const analytics = google.analyticsdata({
    version: 'v1beta',
    auth: await auth.getClient(),
  });

  // Make a request to Google Analytics Data API (GA4)
  const response = await analytics.properties.runReport({
    property: "properties/459634098", // Replace with your actual GA4 property ID
    requestBody: {
      dateRanges: [
        {
          startDate: "30daysAgo",
          endDate: "today"
        }
      ],
      metrics: [
        {
          name: "sessions"
        },
        {
          name: "engagementRate"
        },
        {
          name: "activeUsers"
        },
        {
          name: "eventCount"
        }
      ],
      dimensions: [
        {
          name: "date" // Add dimensions if you want to break down metrics by date
        }
      ]
    }
  });

  // Return the fetched data as a JSON response
  return json(response.data);
}
