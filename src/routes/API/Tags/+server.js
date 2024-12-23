// Path: "C:\Users\THABANG\Desktop\New folder\Share2Teach_FumbleR\Share2Teach\src\routes\API\Tags\+server.js"

import TagDAO from '../../../lib/DAOClasses/TagDAO.js'; // Adjust as necessary
import Tag from '../../../lib/Classes/Tag.js';
import { json } from '@sveltejs/kit';

/**
 * @swagger
 * /API/Tags:
 *   get:
 *     tags: [Tags]
 *     summary: Retrieve all tags
 *     responses:
 *       200:
 *         description: A list of tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   TagID:
 *                     type: integer
 *                     description: The ID of the tag
 *                   Name:
 *                     type: string
 *                     description: The name of the tag
 *       500:
 *         description: Internal Server Error
 */
export async function GET() {
    const tagDAO = new TagDAO();
    try {
        await tagDAO.connect();
        const tags = await tagDAO.getAllTags();

        return json(tags, { status: 200 });
    } catch (error) {
        console.error('Error fetching all tags:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await tagDAO.disconnect();
    }
}

/**
 * @swagger
 * /API/Tags:
 *   post:
 *     tags: [Tags]
 *     summary: Create a new tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the tag
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Tag created successfully
 *       400:
 *         description: Bad request due to missing name
 *       500:
 *         description: Internal Server Error
 */
export async function POST({ request }) {
    const tagDAO = new TagDAO();
    try {
        const data = await request.json();
        // Ensure that data.name exists
        if (!data.name) {
            return json({ error: 'Name is required' }, { status: 400 });
        }

        const tag = new Tag(null, data.name);  // Pass null for TagID for new tags

        await tagDAO.connect();
        await tagDAO.createTag(tag);

        return json({ message: 'Tag created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error creating Tag:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
