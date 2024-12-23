import { json } from '@sveltejs/kit';
import FileDAO from '../../../lib/DAOClasses/FileDAO.js';
import File from '../../../lib/Classes/File.js';

const files = new FileDAO();

/**
 * @swagger
 * tags:
 *   name: Document
 *   description: API for managing Documents
 */

/**
 * @swagger
 * /API/document:
 *   post:
 *     tags: [Document]
 *     summary: Search for documents
 *     description: This endpoint allows you to search for documents based on a search term.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               searchTerm:
 *                 type: string
 *                 description: The term to search for in documents.
 *     responses:
 *       200:
 *         description: Document search results.
 *       500:
 *         description: Failed to search documents.
 */
export async function POST({ request }) {
    const { searchTerm } = await request.json();
    
    try {
        const doc = await files.searchDocument(searchTerm);
        return json(doc);
    } catch (error) {
        console.error('Error searching documents:', error);
        return json({ error: 'Failed to search documents' }, { status: 500 });
    }
}

/**
 * @swagger
 * /API/document:
 *   put:
 *     tags: [Document]
 *     summary: Report a file
 *     description: This endpoint allows you to report a file with a specific reason.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *                 description: The ID of the user reporting the file.
 *               path:
 *                 type: string
 *                 description: The file path of the document.
 *               type:
 *                 type: string
 *                 description: The type of the file.
 *               approvedAt:
 *                 type: string
 *                 description: The timestamp when the file was approved.
 *               status:
 *                 type: string
 *                 description: The current status of the file.
 *               report:
 *                 type: string
 *                 description: The reason for reporting the file.
 *               grade:
 *                 type: string
 *                 description: The grade associated with the file.
 *               subjectID:
 *                 type: string
 *                 description: The ID of the subject related to the file.
 *               fileSize:
 *                 type: integer
 *                 description: The size of the file in bytes.
 *               fileID:
 *                 type: string
 *                 description: The unique identifier of the file.
 *     responses:
 *       200:
 *         description: File reported successfully.
 *       400:
 *         description: Missing fileId or report reason.
 *       500:
 *         description: Failed to report file.
 */
export async function PUT({ request }) {
    try {
        const DATA = await request.json(); 
        console.log(DATA);

        let fileO = new File(
            DATA.userID, DATA.path, DATA.type, DATA.approvedAt, DATA.status,
            DATA.report, DATA.grade, DATA.subjectID, DATA.fileSize, DATA.fileID
        );

        // Input validation
        if (!fileO.fileID || !fileO.report) {
            return json({ error: 'Missing fileId or reportReason' }, { status: 400 });
        }

        const report = await files.reportFile(fileO.fileID, fileO.report);
        
        return json({ report: "File updated successfully" });
    } catch (error) {
        console.error('Error reporting file:', error);
        return json({ error: 'Failed to report file' }, { status: 500 });
    }
}
