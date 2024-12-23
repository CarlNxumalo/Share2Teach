import Subject from '../../lib/Classes/Subject.js';
import sql from 'mssql';

class SubjectDAO {
    constructor() {
        this.connectionString = "Server=tcp:share2teach-server.database.windows.net,1433;Initial Catalog=Share2Teach;Persist Security Info=False;User ID=admin-server;Password=share2teach#IT;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";
        this.pool = null; // Initialize pool to null
    }

    async connect() {
        try {
            if (!this.pool) { // Check if pool is already connected
                this.pool = await sql.connect(this.connectionString);
            }
        } catch (error) {
            console.error('Failed to connect to the database:', error);
            throw error;
        }
    }

    async disconnect() {
        try {
            if (this.pool) { // Only close if pool exists
                await this.pool.close();
                this.pool = null; // Reset pool to null after closing
            }
        } catch (error) {
            console.error('Failed to close the database connection:', error);
        }
    }

    // Add a new subject
    async addSubject(subjectID) {
        try {
            await this.connect(); // Ensure connection is established

            const query = 'INSERT INTO Subject (Code, Name, Description, CreatedAt, UpdatedAt) VALUES (@code, @name, @description, @createdAt, @updatedAt)';
            await this.pool.request()
                .input('code', sql.NVarChar, subjectID.Code)
                .input('name', sql.NVarChar, subjectID.Name)
                .input('description', sql.NVarChar, subjectID.Description)
                .input('createdAt', sql.Date, subjectID.CreatedAt)
                .input('updatedAt', sql.Date, subjectID.UpdatedAt)
                .query(query);
            
        } catch (error) {
            console.error('Failed to create subject:', error);
            throw error;
        }
    }

    // Get a subject by ID
    async getSubjectById(id) {
        try {
            await this.connect(); // Ensure connection is established

            const result = await this.pool.request()
                .input('id', sql.Int, id)
                .query('SELECT * FROM SUBJECT WHERE SubjectID = @id;');
            
            if (result.recordset.length > 0) {
                const row = result.recordset[0];
                return new Subject(
                    row.SubjectID,
                    row.Name,
                    row.Code,
                    row.Description,
                    row.CreatedAt,
                    row.UpdatedAt
                );
            } else {
                return null;
            }
        } catch (error) {
            console.error('Failed to retrieve Subject by ID:', error);
            throw error;
        }
    }

    // Get all subjects
    async getAllSubjects() {
        try {
            await this.connect(); // Ensure connection is established

            const result = await this.pool.request().query('SELECT * FROM SUBJECT');

            // Map the recordset to match the required format
            const subjects = result.recordset.map(row => new Subject(
                row.SubjectID,
                row.Name,
                row.Code,
                row.Description,
                row.CreatedAt,
                row.UpdatedAt
            ));

            return subjects;
        } catch (error) {
            console.error('Failed to retrieve subjects:', error);
            throw error;
        } finally {
            await this.disconnect(); // Disconnect after the query is done
        }
    }

    // Update a subject
    async updateSubject(subject) {
        try {
            await this.connect(); // Ensure connection is established

            const result = await this.pool.request()
                .input('id', sql.Int, subject.SubjectID)
                .input('name', sql.NVarChar, subject.Name)
                .input('code', sql.NVarChar, subject.Code)
                .input('description', sql.NVarChar, subject.Description)
                .input('createdAt', sql.Date, subject.CreatedAt)
                .input('updatedAt', sql.Date, subject.UpdatedAt)
                .query('UPDATE SUBJECT SET Name = @name, Code = @code, Description = @description, CreatedAt = @createdAt, UpdatedAt = @updatedAt WHERE SubjectID = @id');
            
            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error('Failed to update Subject:', error);
            throw error;
        }
    }

    // Delete a subject
    async deleteSubject(id) {
        try {
            await this.connect(); // Ensure connection is established

            const result = await this.pool.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM SUBJECT WHERE SubjectID = @id');
            
            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error('Failed to delete Subject:', error);
            throw error;
        }
    }
}

export default SubjectDAO;
