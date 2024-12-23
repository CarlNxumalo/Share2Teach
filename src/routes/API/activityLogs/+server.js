/*/** @type {import('./$types').RequestHandler} */

import ActivityLogsDAO from '$lib/DAOClasses/ActivityLogsDAO.js'; 
import ActivityLogs from '$lib/Classes/ActivityLogs.js';

const activityLogsDAO = new ActivityLogsDAO();

/**
 * @swagger
 * tags:
 *   name: ActivityLogs
 *   description: API for managing activity logs
 */

/**
 * @swagger
 * /API/activityLogs:
 *   get:
 *     summary: Get activity logs
 *     tags: [ActivityLogs]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: false
 *         description: Filter logs by user ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched activity logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                       activity_type:
 *                         type: string
 *                       activity_description:
 *                         type: string
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Failed to fetch activity logs
 */
export async function GET({ url }) {
    try {
        const userId = url.searchParams.get('userId'); // Optionally filter by user ID
        const logs = userId 
            ? await activityLogsDAO.getActivityLogsByUserId(userId) 
            : await activityLogsDAO.getAllActivityLogs();
        
        return new Response(JSON.stringify({ logs }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Failed to fetch activity logs:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch activity logs' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

/**
 * @swagger
 * /API/activityLogs:
 *   post:
 *     summary: Log a new activity
 *     tags: [ActivityLogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user
 *               activity_type:
 *                 type: string
 *                 description: Type of the activity
 *               activity_description:
 *                 type: string
 *                 description: Description of the activity
 *     responses:
 *       201:
 *         description: Activity logged successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Error
 */
export async function POST({ request }) {
    try {
        const data = await request.json();
        const activityLog = new ActivityLogs(null, data.TimeStamp,data.activity_type, data.activity_description,data.date_created);
        await activityLogsDAO.logActivity(activityLog);
        return new Response(JSON.stringify({ message: "Activity logged successfully!" }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Failed to log activity:', error);
        return new Response(JSON.stringify({ message: "Internal Error" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

/**
 * @swagger
 * /API/activityLogs:
 *   delete:
 *     summary: Delete an activity log
 *     tags: [ActivityLogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               logId:
 *                 type: string
 *                 description: ID of the log to delete
 *     responses:
 *       200:
 *         description: Activity log deleted successfully
 *       400:
 *         description: Failed to delete activity log
 */
export async function DELETE({ request }) {
    try {
        const { logId } = await request.json();
        await activityLogsDAO.deleteActivityLog(logId);
        return new Response(JSON.stringify({ message: 'Activity log deleted successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Failed to delete activity log:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete activity log' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    
}

