import { json } from '@sveltejs/kit';
import UserDAO from '../../../../lib/DAOClasses/UserDAO.js'; // Adjust as necessary
import User from '../../../../lib/Classes/User.js';

const userDAO = new UserDAO();
await userDAO.connect();



/**
 * @swagger
 * /API/User/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userID:
 *                   type: integer
 *                 fName:
 *                   type: string
 *                 lName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

// Get a user by ID
export const GET = async ({ params }) => {
    try {
        const { id } = params;
        const user = await userDAO.getUserById(id);

        if (user) {
            return json(user, { status: 200 });
        } else {
            return json({ error: 'User not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
};

/**
 * @swagger
 * /API/User/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fName:
 *                 type: string
 *                 example: John
 *               lName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: SecurePassword123
 *               role:
 *                 type: string
 *                 example: A
 *               gender:
 *                 type: string
 *                 enum: [M, F]
 *                 example: M
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-09-26T12:34:56Z"
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-09-26T12:34:56Z"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       500:
 *         description: Internal Server Error
 */

// Update a user by ID
export const PUT = async ({ params, request }) => {
    try {
        const { id } = params;
        const Data = await request.json();
        console.log(Data)
        const success = await userDAO.updateRole(id,Data.role);
        if (success) {
            return json({ message: 'User updated successfully!' }, { status: 200 });
        } else {
            return json({ error: 'Failed to update user' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
};

/**
 * @swagger
 * /API/User/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       500:
 *         description: Internal Server Error
 */

// Delete a user by ID
export const DELETE = async ({ params }) => {
    try {
        const { id } = params;
        const success = await userDAO.deleteUser(id);

        if (success) {
            return json({ message: 'User deleted successfully!' }, { status: 200 });
        } else {
            return json({ error: 'Failed to delete user' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
};






