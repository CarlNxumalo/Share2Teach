import { json } from '@sveltejs/kit';
import UserDAO from '../../../lib/DAOClasses/UserDAO.js'; // Adjust as necessary
import User from '../../../lib/Classes/User.js';

const userDAO = new UserDAO();
await userDAO.connect();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API to manage users
 */

/**
 * @swagger
 * /API/User:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
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
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /API/User:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userID:
 *                     type: integer
 *                   fName:
 *                     type: string
 *                   lName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                   gender:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal Server Error
 */

export async function POST({ request }) {
  try {
    const Data = await request.json();  
    const user = new User(
      null, // userID can be set later, if needed
      Data.fName,
      Data.lName,
      Data.email,
      Data.password,
      Data.role,
      Data.gender,
      new Date(Data.createdAt),
      new Date(Data.updatedAt)
    );



    const userDAO = new UserDAO();
    await userDAO.connect(); // Ensure you connect to the database
    await userDAO.addUser(user);
    return json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating User:', error);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
};

export const GET = async () => {
  try {
    const userDAO = new UserDAO();
    await userDAO.connect();
    const user = await userDAO.getAllUsers();
    console.log(user);
    return json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
};


