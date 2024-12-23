import { json } from '@sveltejs/kit';
import FAQDAO from '../../../../lib/DAOClasses/FAQDAO.js'; // Adjust this path as necessary 
import FAQ from '../../../../lib/Classes/FAQ.js'; // Adjust this path as necessary

const faqDAO = new FAQDAO();
await faqDAO.connect();

/**
 * @swagger
 * tags:
 *   name: FAQs
 *   description: API for managing FAQs
 */

/**
 * @swagger
 * /API/FAQ/{id}:
 *   get:
 *     tags: [FAQs]
 *     summary: Get a specific FAQ by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the FAQ to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single FAQ object
 *       404:
 *         description: FAQ not found
 *       500:
 *         description: Internal Server Error
 */
export const GET = async ({ params }) => {
    try {
        const { id } = params;
        const faq = await faqDAO.getFAQById(id);
        if (faq) {
            return json(faq, { status: 200 });
        } else {
            return json({ error: 'FAQ not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error fetching FAQ:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await faqDAO.disconnect();
    }
};

/**
 * @swagger
 * /API/FAQ/{id}:
 *   put:
 *     tags: [FAQs]
 *     summary: Update a specific FAQ by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the FAQ to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 description: The updated question for the FAQ
 *               answer:
 *                 type: string
 *                 description: The updated answer for the FAQ
 *     responses:
 *       200:
 *         description: FAQ updated successfully
 *       404:
 *         description: FAQ not found
 *       500:
 *         description: Internal Server Error
 */
export const PUT = async ({ request, params }) => {
    try {
        const { id } = params;
        const data = await request.json();
        const faq = new FAQ(id, data.question, data.answer);
        const success = await faqDAO.updateFAQ(faq);
        if (success) {
            return json({ message: 'FAQ updated successfully' }, { status: 200 });
        } else {
            return json({ error: 'FAQ not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error updating FAQ:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await faqDAO.disconnect();
    }
};

/**
 * @swagger
 * /API/FAQ/{id}:
 *   delete:
 *     tags: [FAQs]
 *     summary: Delete a specific FAQ by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the FAQ to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: FAQ deleted successfully
 *       404:
 *         description: FAQ not found
 *       500:
 *         description: Internal Server Error
 */
export const DELETE = async ({ params }) => {
    try {
        const { id } = params;
        const success = await faqDAO.deleteFAQ(id);
        if (success) {
            return json({ message: 'FAQ deleted successfully' }, { status: 200 });
        } else {
            return json({ error: 'FAQ not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await faqDAO.disconnect();
    }
};


