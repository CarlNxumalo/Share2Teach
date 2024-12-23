import TagDAO from '../../../../lib/DAOClasses/TagDAO.js'; // Adjust as necessary
import Tag from '../../../../lib/Classes/Tag.js';
import { json } from '@sveltejs/kit';

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: API for managing tags
 */

/**
 * @swagger
 * /API/Tags:
 *   get:
 *     summary: Get all tags
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: A list of tags
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /API/Tags:
 *   post:
 *     summary: Create a new tag
 *     tags: [Tags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tag created successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /API/Tags/{id}:
 *   get:
 *     summary: Get a tag by ID
 *     tags: [Tags]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the tag
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tag found
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /API/Tags/{id}:
 *   put:
 *     summary: Update a tag by ID
 *     tags: [Tags]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the tag
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tag updated successfully
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /API/Tags/{id}:
 *   delete:
 *     summary: Delete a tag by ID
 *     tags: [Tags]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the tag
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tag deleted successfully
 *       500:
 *         description: Internal Server Error
 */

// GET a specific tag by ID
export const GET = async ({ params }) => {
    const tagDAO = new TagDAO();
    try {
        const { id } = params;
        await tagDAO.connect();
        const tag = await tagDAO.getTagByID(id);
  
        if (tag) {
            return json(tag, { status: 200 });
        } else {
            return json({ error: 'Tag not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error fetching tag by ID:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await tagDAO.disconnect();
    }
};

// Update a tag by ID
export const PUT = async ({ params, request }) => {
    const tagDAO = new TagDAO();
    try {
        const data = await request.json();
        const tag = new Tag(data.tagID, data.name);

        await tagDAO.connect();
        const success = await tagDAO.updateTag(tag);

        if (success) {
            return json({ message: 'Tag updated successfully!' }, { status: 200 });
        } else {
            return json({ error: 'Failed to update tag' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error updating tag:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await tagDAO.disconnect();
    }
};

// DELETE a tag by ID
export const DELETE = async ({ params }) => {
    const tagDAO = new TagDAO();
    try {
        const { id } = params;

        await tagDAO.connect();
        const success = await tagDAO.deleteTag(id);

        if (success) {
            return json({ message: 'Tag deleted successfully!' }, { status: 200 });
        } else {
            return json({ error: 'Failed to delete tag' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error deleting tag:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await tagDAO.disconnect();
    }
};

