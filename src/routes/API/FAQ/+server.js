import { json } from '@sveltejs/kit';
import FAQDAO from '../../../lib/DAOClasses/FAQDAO.js'; // Adjust this path as necessary




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
 * /API/FAQ:
 *   get:
 *     tags: [FAQs]
 *     summary: Get all FAQs
 *     responses:
 *       200:
 *         description: A list of FAQs
 *       500:
 *         description: Internal Server Error
 */
export const GET = async () => {
    try {
        const faqs = await faqDAO.getAllFAQs();
        return json(faqs, { status: 200 });
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await faqDAO.disconnect();
    }
};

/**
 * @swagger
 * /API/FAQ:
 *   post:
 *     tags: [FAQs]
 *     summary: Create a new FAQ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 description: The question for the FAQ
 *               answer:
 *                 type: string
 *                 description: The answer for the FAQ
 *     responses:
 *       201:
 *         description: FAQ created successfully
 *       500:
 *         description: Internal Server Error
 */
export async function POST({ request }) {
    const faqData = await request.json(); // Parse the JSON body
    const faqDAO = new FAQDAO();
    
    try {
        await faqDAO.connect(); // Ensure you connect to the database
        await faqDAO.createFAQ(faqData);
        return json({ message: 'FAQ created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error creating FAQ:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await faqDAO.disconnect(); // Always disconnect
    }
}
