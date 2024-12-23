import TagDAO from '$lib/DAOClasses/TagDAO.js';
import { json } from '@sveltejs/kit'; // Import the json function for response handling

const tagDAO = new TagDAO();

/**
 * @swagger
 * tags:
 *   - name: FetchTags
 *     description: API to manage file tagging
 */

/**
 * @swagger
 * /API/FileTags/FetchTag/{id}:
 *   post:
 *     tags:
 *       - FetchTags
 *     summary: Tag a file with a specific tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileID:
 *                 type: integer
 *                 example: 1
 *               tagID:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: File successfully tagged
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File successfully tagged
 *       400:
 *         description: Invalid fileID or tagID
 *       500:
 *         description: Failed to tag file
 */
export async function POST({ request }) {
    try {
        // Get JSON data from the request
        const { fileID, tagID } = await request.json();
        // Parse IDs to integers
        const fileIdInt = parseInt(fileID, 10);
        const tagIdInt = parseInt(tagID, 10);

        // Validate that IDs are numbers
        if (isNaN(fileIdInt) || isNaN(tagIdInt)) {
            return json({ error: 'Invalid fileID or tagID' }, { status: 400 });
        }

        // Call the tagFile method
        await tagDAO.tagFile(fileIdInt, tagIdInt);

        return json({ message: 'File successfully tagged' }, { status: 201 });
    } catch (error) {
        console.error('Error tagging file:', error);
        return json({ error: 'Failed to tag file' }, { status: 500 });
    }
}

/**
 * @swagger
 * /API/FileTags/FetchTag/{id}:
 *   delete:
 *     tags:
 *       - FetchTags
 *     summary: Untag a file from a specific tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileID:
 *                 type: integer
 *                 example: 1
 *               tagID:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: File successfully untagged
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File successfully untagged
 *       400:
 *         description: Invalid fileID or tagID
 *       404:
 *         description: No matching record found to untag
 *       500:
 *         description: Failed to untag file
 */
export async function DELETE({ request }) {
    console.log('DELETE request received'); // Log the request for debugging

    try {
        const data = await request.json(); // Corrected variable name from Data to data
        const { fileID, tagID } = data; // Destructure the data object

        // Parse IDs to integers
        const fileIdInt = parseInt(fileID, 10);
        const tagIdInt = parseInt(tagID, 10);

        // Validate that IDs are numbers
        if (isNaN(fileIdInt) || isNaN(tagIdInt)) {
            return json({ error: 'Invalid fileID or tagID' }, { status: 400 });
        }

        // Call the untagFile method
        const success = await tagDAO.untagFile(fileIdInt, tagIdInt);

        if (success) {
            return json({ message: 'File successfully untagged' }, { status: 200 });
        } else {
            return json({ error: 'No matching record found to untag' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error untagging file:', error);
        return json({ error: 'Failed to untag file' }, { status: 500 });
    }
}
