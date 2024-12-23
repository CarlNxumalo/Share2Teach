import { json } from '@sveltejs/kit';
import FileServerDAO from '$lib/DAOClasses/FileServerDAO.js'; 
import dotenv from 'dotenv';
dotenv.config();

const containerName = 'files';
const fileServerDAO = new FileServerDAO(process.env.FILE_CON_STR, containerName);
//HELLO

/**
 * @swagger
 * tags:
 *   - name: Metadata
 *     description: API for managing Metadata
 */

/**
 * @swagger
 * /API/blob/metadata/{id}:
 *   post:
 *     tags:
 *       - Metadata
 *     summary: Set metadata for a file
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the file to set metadata for.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *                 description: The metadata key.
 *               value:
 *                 type: string
 *                 description: The metadata value.
 *     responses:
 *       200:
 *         description: Metadata set successfully.
 *       400:
 *         description: Bad Request. Invalid input data.
 *       500:
 *         description: Internal Server Error.
 */
export const POST = async ({ params, request }) => {
    const { id } = params;
    await fileServerDAO.connect(); 
    const metadata = await request.json();

    // Validate the input metadata
    if (!metadata.key || typeof metadata.key !== 'string' || !metadata.value || typeof metadata.value !== 'string') {
        return json({ error: 'Bad Request. Invalid input data.' }, { status: 400 });
    }

    try {
        await fileServerDAO.setMetadata(id, metadata);
        return json({ message: 'Metadata set successfully' }, { status: 200 });
    } catch (error) {
        console.error(`Error setting metadata for ID ${id}:`, error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    } 
};

/**
 * @swagger
 * /API/blob/metadata/{id}:
 *   get:
 *     tags:
 *       - Metadata
 *     summary: Get metadata for a file
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the file to get metadata for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Metadata retrieved successfully.
 *       404:
 *         description: Not Found. The file does not exist.
 *       500:
 *         description: Internal Server Error.
 */
export const GET = async ({ params }) => {
    const { id } = params;
    await fileServerDAO.connect(); 
    try {
        const metadata = await fileServerDAO.getMetadata(id);
        if (!metadata) {
            return json({ error: 'Not Found. The file does not exist.' }, { status: 404 });
        }
        return json(metadata, { status: 200 });
    } catch (error) {
        console.error(`Error getting metadata for ID ${id}:`, error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    } 
};

/**
 * @swagger
 * /API/blob/metadata/{id}:
 *   delete:
 *     tags:
 *       - Metadata
 *     summary: Delete metadata for a file
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the file to delete metadata from.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keys:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of keys to delete.
 *     responses:
 *       200:
 *         description: Metadata deleted successfully.
 *       404:
 *         description: Not Found. The file does not exist.
 *       500:
 *         description: Internal Server Error.
 */
export const DELETE = async ({ params, request }) => {
    const { id } = params;
    const { keys } = await request.json(); // Expecting an array of keys to delete
    await fileServerDAO.connect(); 
    
    // Validate keys
    if (!Array.isArray(keys) || keys.some(key => typeof key !== 'string')) {
        return json({ error: 'Bad Request. Invalid keys provided.' }, { status: 400 });
    }

    try {
        await fileServerDAO.deleteMetadata(id, keys);
        return json({ message: 'Metadata deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error(`Error deleting metadata for ID ${id}:`, error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
};
