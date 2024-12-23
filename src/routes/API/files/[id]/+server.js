
import { json } from '@sveltejs/kit';
import FileDAO from '../../../../lib/DAOClasses/FileDAO.js'; // Adjust as necessary
import { FILE_CON_STR } from '$env/static/private';
import FileServerDAO from '$lib/DAOClasses/FileServerDAO.js';

/**
 * @swagger
 * /API/files/{id}:
 *   put:
 *     tags: [Files]
 *     summary: Update a file by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the file to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *                 description: The ID of the user associated with the file
 *               path:
 *                 type: string
 *                 description: The storage path of the file
 *               type:
 *                 type: string
 *                 description: The type of the file (e.g., pdf, docx)
 *               approvedAt:
 *                 type: string
 *                 format: date-time
 *                 description: The date the file was approved
 *               status:
 *                 type: string
 *                 description: The status of the file (e.g., active, inactive)
 *               report:
 *                 type: string
 *                 description: Any reports associated with the file
 *               grade:
 *                 type: string
 *                 description: The grade level associated with the file
 *               subjectID:
 *                 type: string
 *                 description: The ID of the subject related to the file
 *               fileSize:
 *                 type: integer
 *                 description: The size of the file in bytes
 *     responses:
 *       200:
 *         description: File updated successfully
 *       400:
 *         description: Bad request due to invalid input
 *       500:
 *         description: Internal Server Error
 */
export const PUT = async ({ params, request }) => {
    try {
        const { id } = params; // Get the file ID from the route parameters
        const fileData = await request.json(); // Get the file data from the request body
        console.log("this is the file ID"+id)
        const fileDAO = new FileDAO(); // Create an instance of FileDAO
        await fileDAO.connect(); // Connect to the database

        fileData.fileId = id;
        console.log(fileData); // Add the file ID to the fileData object
        const success = await fileDAO.moderateFile(fileData); // Call the moderateFile method to update the file
        await fileDAO.reportFile(id, fileData.report)
        if (success) {
            return json({ message: 'File updated successfully!' }, { status: 200 });
        } else {
            return json({ error: 'Failed to update file' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error updating file:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
};

/**
 * @swagger
 * /API/files/{id}:
 *   delete:
 *     tags: [Files]
 *     summary: Delete a file by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the file to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       400:
 *         description: Bad request due to missing ID
 *       500:
 *         description: Internal Server Error
 */
export async function DELETE({ params }) {
    const { id } = params; // Get the file ID from the route parameters

    if (!id) {
        return json({ error: 'File ID is required' }, { status: 400 });
    }

    const fileDAO = new FileDAO();
    const fileServerDAO = new FileServerDAO();

    try {
        await fileDAO.connect();
        await fileServerDAO.connect();
        const file = await fileDAO.getFileById(parseInt(id))
        console.log(file.Path)
        await fileDAO.deleteFile(parseInt(id)); // Convert id to an integer
        await fileServerDAO.deleteFile(file.Path);
        return json({ message: 'File deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting file:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        try {
            await fileDAO.disconnect(); // Always try to disconnect even if there's an error
        } catch (disconnectError) {
            console.error('Error closing database connection:', disconnectError);
        }
    }
}

