/** @type {import('./$types').RequestHandler} */

import SubjectDAO from '../../../lib/DAOClasses/SubjectDAO.js'; // Adjust as necessary

import Subject from '../../../lib/Classes/Subject.js';


const subjectDAO = new SubjectDAO();

/**
 * @swagger
 * tags:
 *   name: Subjects
 *   description: API for managing subjects
 */

/**
 * @swagger
 * /API/subjects:
 *   get:
 *     tags: [Subjects]
 *     summary: Get all subjects or a specific subject by ID
 *     parameters:
 *       - in: query
 *         name: SubjectID
 *         required: false
 *         description: The ID of the subject to fetch (optional)
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of subjects or a specific subject
 *       500:
 *         description: Failed to fetch subjects
 */
export async function GET({ url }) {
    try {
        const SubjectID = url.searchParams.get('SubjectID'); // Optional: Get subject by ID
        const logs = SubjectID 
        ? await subjectDAO.getSubjectById(SubjectID)
        : await subjectDAO.getAllSubjects();
        return new Response(JSON.stringify({ logs }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch subjects' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

/**
 * @swagger
 * /API/subjects:
 *   post:
 *     tags: [Subjects]
 *     summary: Create a new subject
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Subject created successfully
 *       400:
 *         description: Failed to create subject
 */
export async function POST({ request }) {
    try {
        const data = await request.json();
        const subject = new Subject(data.name, data.code, data.description, data.description, data.createdAt, data.updatedAt);
        await subjectDAO.addSubject(subject);
        return new Response(JSON.stringify({ message: 'Subject created successfully' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to create subject' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

/**
 * @swagger
 * /API/subjects:
 *   put:
 *     tags: [Subjects]
 *     summary: Update an existing subject
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Subject updated successfully
 *       400:
 *         description: Failed to update subject
 */
export async function PUT({ request }) {
    try {
        const data = await request.json();
        const subject = new Subject(data.Name, data.Code, data.Description, data.CreatedAt, data.UpdatedAt);
        await subjectDAO.updateSubject(subject);
        return new Response(JSON.stringify({ message: 'Subject updated successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to update subject' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

/**
 * @swagger
 * /API/subjects:
 *   delete:
 *     tags: [Subjects]
 *     summary: Delete a subject by ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Subject deleted successfully
 *       400:
 *         description: Failed to delete subject
 */
export async function DELETE({ request }) {
    try {
        const { id } = await request.json();
        await subjectDAO.deleteSubject(id);
        return new Response(JSON.stringify({ message: 'Subject deleted successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to delete subject' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}


