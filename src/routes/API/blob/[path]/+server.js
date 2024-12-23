/**
 * @swagger
 * tags:
 *   - name: Blob
 *     description: API for managing Blob
 */

/**
 * @swagger
 * /API/blob/{path}:
 *   post:
 *     tags:
 *       - Blob
 *     summary: Set metadata for a file
 *     description: This endpoint allows you to set metadata for a specified file path.
 *     parameters:
 *       - name: path
 *         in: path
 *         required: true
 *         description: The path of the file to set metadata for.
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
 *       500:
 *         description: Internal Server Error.
 */
export const POST = async ({ params, request }) => {
    const { path } = params;
    await fileServerDAO.connect(); 
    const metadata = await request.json();

    try {
        await fileServerDAO.setMetadata(path, metadata);
        return json({ message: 'Metadata set successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error setting metadata:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    } 
};

/**
 * @swagger
 * /API/blob/{path}:
 *   get:
 *     tags:
 *       - Blob
 *     summary: Get metadata for a file
 *     description: This endpoint retrieves the metadata for a specified file path.
 *     parameters:
 *       - name: path
 *         in: path
 *         required: true
 *         description: The path of the file to get metadata for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Metadata retrieved successfully.
 *       500:
 *         description: Internal Server Error.
 */
export const GET = async ({ params }) => {
    const { path } = params;
    await fileServerDAO.connect(); 
    try {
        const metadata = await fileServerDAO.getMetadata(path);
        return json(metadata, { status: 200 });
    } catch (error) {
        console.error('Error getting metadata:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    } 
};

/**
 * @swagger
 * /API/blob/{path}:
 *   delete:
 *     tags:
 *       - Blob
 *     summary: Delete metadata for a file
 *     description: This endpoint allows you to delete metadata for a specified file path.
 *     parameters:
 *       - name: path
 *         in: path
 *         required: true
 *         description: The path of the file to delete metadata from.
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
 *       500:
 *         description: Internal Server Error.
 */
export const DELETE = async ({ params, request }) => {
    const { path } = params;
    const { keys } = await request.json(); // Expecting an array of keys to delete
    await fileServerDAO.connect(); 
    try {
        await fileServerDAO.deleteMetadata(path, keys);
        return json({ message: 'Metadata deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting metadata:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
};
