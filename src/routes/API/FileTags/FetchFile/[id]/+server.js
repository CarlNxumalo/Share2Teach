import { json } from '@sveltejs/kit'; // Import the json function to create a response
import TagDAO from '$lib/DAOClasses/TagDAO.js'; // Adjust the import path as necessary

const tagDAO = new TagDAO();

/**
 * @swagger
 * tags:
 *   - name: FetchFile
 *     description: API for tags associated with a specific file
 */

/**
 * @swagger
 * /API/FileTags/FetchFile/{id}:
 *   get:
 *     tags:
 *       - FetchFile
 *     summary: Get tags associated with a specific file
 *     description: Fetches a list of tags for a given file ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the file for which tags are being retrieved.
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: A list of tags for the specified file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       tagID:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "JavaScript"
 *       400:
 *         description: Invalid fileID provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid fileID"
 *       500:
 *         description: Failed to fetch tags for the file due to a server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch tags for file"
 */

/**
 * GET method to retrieve tags for a specific file
 * @param {Object} params - Parameters containing the file ID
 */
export async function GET({ params }) {
    const { id } = params;

    try {
        // Parse fileID to an integer
        const fileIdInt = parseInt(id, 10);

        // Validate that fileID is a number
        if (isNaN(fileIdInt)) {
            return json({ error: 'Invalid fileID' }, { status: 400 });
        }

        // Call the getTagsForFile method
        const tags = await tagDAO.getTagsForFile(fileIdInt);

        return json({ tags }, { status: 200 }); // Return the list of tags as a Response object
    } catch (error) {
        console.error('Error fetching tags for file:', error);
        return json({ error: 'Failed to fetch tags for file' }, { status: 500 });
    }
}
