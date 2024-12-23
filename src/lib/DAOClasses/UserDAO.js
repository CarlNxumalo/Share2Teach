import sql from 'mssql';
import User from '../../lib/Classes/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 

class UserDAO {
    constructor() {
        this.connectionString = {
            user: 'admin-server',
            password: 'share2teach#IT',
            server: 'share2teach-server.database.windows.net',
            database: 'Share2Teach',
            options: {
                encrypt: true,
                trustServerCertificate: false
            }
        };
        this.jwtSecret = 'your-secret-key'; // Hardcoded JWT secret for demonstration
    }


    async connect() {
        try {
            return await sql.connect(this.connectionString);
        } catch (error) {
            console.error('Database connection failed:', error);
            throw error;
        }
    }

    // Hash and Add a new User
    async addUser(user) {
        
        const query = `
            INSERT INTO Users (FName, LName, Email, Password, Role, Gender, Created_at, Updated_at)
            VALUES (@FName, @LName, @Email, @Password, @Role, @Gender, @CreatedAt, @UpdatedAt)
        `;
        try {
            const pool = await this.connect();
            await pool.request()
                .input('FName', sql.VarChar, user.fName)
                .input('LName', sql.VarChar, user.lName)
                .input('Email', sql.VarChar, user.email)
                .input('Password', sql.VarChar, user.password)  // Store hashed password
                .input('Role', sql.VarChar, user.role)
                .input('Gender', sql.VarChar, user.gender)
                .input('CreatedAt', sql.DateTime, user.createdAt)
                .input('UpdatedAt', sql.DateTime, user.updatedAt)
                .query(query);
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    }

    // Validate user credentials and create a JWT
    async validateUser(email, password) {
        const query = 'SELECT * FROM Users WHERE Email = @Email';
        try {
            const pool = await this.connect();
            const result = await pool.request()
                .input('Email', sql.VarChar, email)
                .query(query);

            const user = result.recordset[0];
            if (user) {
                const isMatch = await bcrypt.compare(password, user.Password);  // Compare password
                console.log(`Password match status for ${email}:`, isMatch);
                if (isMatch) {
                    // Generate JWT token
                    const token = jwt.sign(
                        { userId: user.UserID, email: user.Email, role: user.Role },
                        this.jwtSecret, // Using hardcoded secret
                        { expiresIn: '1h' }
                    );
                    console.log("JWT generated for user:", user.UserID);
                    return { token, user: new User(user.UserID, user.FName, user.LName, user.Email, user.Password, user.Role, user.Gender, user.Created_at, user.Updated_at) };
                }
            }
            return null;
        } catch (error) {
            console.error('Error validating user:', error);
            throw error;
        }
    }

    // Get user by ID
    async getUserById(userID) {
        const query = 'SELECT * FROM Users WHERE UserID = @UserID';
        try {
            const pool = await this.connect();
            const result = await pool.request()
                .input('UserID', sql.Int, userID)
                .query(query);
            
            const row = result.recordset[0];
            if (row) {
                return new User(row.UserID, row.FName, row.LName, row.Email, row.Password, row.Role, row.Gender, row.Created_at, row.Updated_at);
            }
            return null;
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            throw error;
        }
    }

    async emailExists(email) {
        const query = 'SELECT Email FROM USERS WHERE Email = @Email'; // Query for matching email
        try {
            const pool = await this.connect(); // Establish connection
            const result = await pool.request()
                .input('Email', sql.NVarChar, email) // Bind the email parameter as NVarChar
                .query(query); // Execute the query
    
            if (result.recordset.length > 0) {
                // If the email exists, return true
                return true;
            } else {
                // If no matching email found, return false
                return false;
            }
        } catch (error) {
            console.error('Error checking email existence:', error);
            throw new Error('Database query failed'); // Throw an error for further handling
        }
    }
    
    
    

    // Get all users
    async getAllUsers() {
        const query = 'SELECT * FROM Users';
        try {
            const pool = await this.connect();
            const result = await pool.request().query(query);
            return result.recordset.map(row => new User(row.UserID, row.FName, row.LName, row.Email, row.Password, row.Role, row.Gender, row.Created_at, row.Updated_at));
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw error;
        }
    }
    async updateRole(userID, role) {
        const query = `
            UPDATE Users 
            SET  Role = @Role
            WHERE UserID = @UserID
        `;
        try {
            const pool = await this.connect();
            const result = await pool.request()
                .input('Role', sql.VarChar, role)
                .input('UserID', sql.Int, userID)
                .query(query);

            return result.rowsAffected[0] > 0;
          // Returns true if a row was updated
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }
    // In updateUser method
async updateUser(user) {
    const query = `
        UPDATE Users 
        SET FName = @FName, LName = @LName, Email = @Email, Password = @Password, Role = @Role, Gender = @Gender, Updated_at = @UpdatedAt
        WHERE UserID = @UserID
    `;
    try {
        const pool = await this.connect();
        const request = pool.request()
            .input('FName', sql.VarChar, user.fName)
            .input('LName', sql.VarChar, user.lName)
            .input('Email', sql.VarChar, user.email)
            .input('Role', sql.VarChar, user.role)
            .input('Gender', sql.VarChar, user.gender)
            .input('UpdatedAt', sql.DateTime, user.updatedAt)
            .input('UserID', sql.Int, user.userID);

        // Check if password is defined before adding it to the request
        if (user.password) {
            const hashedPassword = await bcrypt.hash(user.password, 10); // Hash the password
            request.input('Password', sql.VarChar, hashedPassword); // Use the hashed password
        }

        const result = await request.query(query);

        return result.rowsAffected[0] > 0; // Returns true if a row was updated
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}


    // Delete a user
    async deleteUser(userID) {
        const query = 'DELETE FROM Users WHERE UserID = @UserID';
        try {
            const pool = await this.connect();
            const result = await pool.request()
                .input('UserID', sql.Int, userID)
                .query(query);
            return result.rowsAffected[0] > 0; // Returns true if a row was deleted
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    async updatePassword(email, newPassword, confirmPassword) {
        // Check if the new password matches the confirmed password
        if (newPassword !== confirmPassword) {
            throw new Error('New password and confirmed password do not match.');
        }
        
        console.log('New Password:', newPassword, 'Length:', newPassword.length);
    
        // Check if the email exists
        console.log('Checking if email exists:', email);
        const emailExists = await this.emailExists(email);
        if (!emailExists) {
            throw new Error('Email does not exist.');
        }
    
        const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password
        console.log('Hashed Password:', hashedPassword);
    
        const query = 'UPDATE Users SET Password = @Password, Updated_at = GETDATE() WHERE Email = @Email';
    
        try {
            const pool = await this.connect();
            console.log('Database connected:', pool);
            
            const result = await pool.request()
                .input('Password', sql.VarChar, hashedPassword)
                .input('Email', sql.VarChar, email)
                .query(query);
            
            console.log('SQL result:', result);
            
            return result.rowsAffected[0] > 0; // Returns true if the password was updated
        } catch (error) {
            console.error('Error updating password:', error);
            throw new Error('An error occurred while updating the password.'); // Provide a general error message
        }
    }
    
    
}

export default UserDAO;