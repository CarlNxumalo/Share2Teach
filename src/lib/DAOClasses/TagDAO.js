import sql from 'mssql';
import Tag from '../../lib/Classes/Tag.js';

class TagDAO {
    constructor() {
        this.connectionString = "Server=tcp:share2teach-server.database.windows.net,1433;Initial Catalog=Share2Teach;Persist Security Info=False;User ID=admin-server;Password=share2teach#IT;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"; // Use environment variable for the connection string
    }

    async connect() {
        if (!this.pool) {
            try {
                this.pool = await sql.connect(this.connectionString);
            } catch (error) {
                console.error('Failed to connect to the database:', error);
                throw error;
            }
        }
    }

    // Add this method inside your TagDAO class
    async getAllTags() {
        try {
            await this.connect();
            const result = await this.pool.request().query(`
                SELECT * FROM Tags;
            `);
            return result.recordset.map(row => new Tag(row.TagID, row.Name)); // Mapping the result to Tag objects
        } catch (error) {
            console.error('Error fetching all tags:', error);
            throw error;
        } finally {
            await this.disconnect();
        }
    }


    async disconnect() {
        if (this.pool) {
            try {
                await this.pool.close();
                this.pool = null; // Clear the pool reference
            } catch (error) {
                console.error('Failed to close the database connection:', error);
            }
        }
    }

    // Insert a new tag
    async createTag(tag) {
        try {
            await this.connect();
            await this.pool.request()
                .input('name', sql.NVarChar, tag.name) // Use the exact property name
                .query(`
                    INSERT INTO Tags (Name)
                    VALUES (@name)
                `);
        } catch (error) {
            console.error('Failed to create Tag:', error);
            throw error;
        }
    }

    async getTagByID(tagID) {
        try {
            await this.connect();
            const result = await this.pool.request()
                .input('tagID', sql.Int, tagID)
                .query(`
                    SELECT * FROM Tags
                    WHERE TagID = @tagID
                `);
            if (result.recordset.length > 0) {
                const row = result.recordset[0];
                return new Tag(row.TagID, row.Name);
            }
            return null; // No tag found with this ID
        } catch (error) {
            console.error('Error fetching tag by ID:', error);
            throw error;
        } finally {
            await this.disconnect();
        }
    }

    // Link a file with a tag
    async tagFile(fileID, tagID) {
        try {
            await this.connect();
            await this.pool.request()
                .input('fileID', sql.Int, fileID)
                .input('tagID', sql.Int, tagID)
                .query(`
                    INSERT INTO FileTag (FileID, TagID)
                    VALUES (@fileID, @tagID)
                `);
            console.log(`File with ID ${fileID} tagged with tag ID ${tagID}`);
        } catch (error) {
            console.error('Failed to tag file:', error);
            throw error;
        } finally {
            await this.disconnect();
        }
    }

    async updateTag(tag) {
        try {
            await this.connect(); // Ensure you are connected to the database
            console.log(`Updating tag with ID: ${tag.tagID}, Name: ${tag.name}`);
    
            const result = await this.pool.request()
                .input('id', sql.Int, tag.tagID) // Ensure you're passing the correct property
                .input('name', sql.NVarChar, tag.name) // Ensure you're using the correct casing
                .query('UPDATE Tags SET Name = @name WHERE TagID = @id');
    
            // Check if any rows were affected
            if (result.rowsAffected[0] === 0) {
                console.error(`No rows updated for TagID: ${tag.tagID}`);
                return false; // No rows were updated
            }
    
            console.log(`Tag with ID ${tag.tagID} updated successfully`);
            return true; // Successful update
        } catch (error) {
            console.error('Failed to update Tag:', error);
            throw error; // Rethrow the error for further handling
        } finally {
            await this.disconnect(); // Ensure the connection is closed
        }
    }
    
    
    
    

    // Delete a tag by its ID
    async deleteTag(tagID) {
        try {
            await this.connect();
            const result = await this.pool.request()
                .input('tagID', sql.Int, tagID)
                .query(`
                    DELETE FROM Tags
                    WHERE TagID = @tagID
                `);
            return result.rowsAffected[0] > 0; // Return true if a row was deleted
        } catch (error) {
            console.error('Failed to delete Tag:', error);
            throw error;
        } finally {
            await this.disconnect();
        }
    }

    // Unlink a file from a tag
    async untagFile(fileID, tagID) {
        try {
            await this.connect();
            console.log(`Unlinking FileID: ${fileID} from TagID: ${tagID}`); // Log inputs
            const result = await this.pool.request()
                .input('fileID', sql.Int, fileID)
                .input('tagID', sql.Int, tagID)
                .query(`
                    DELETE FROM FileTag
                    WHERE FileID = @fileID AND TagID = @tagID
                `);
            return result.rowsAffected[0] > 0; // Return true if a row was deleted
        } catch (error) {
            console.error('Failed to untag file:', error);
            throw error;
        } finally {
            await this.disconnect();
        }
    }
    

    // Retrieve all tags for a specific file
    async getTagsForFile(fileID) {
        try {
            await this.connect();
            const result = await this.pool.request()
                .input('fileID', sql.Int, fileID)
                .query(`
                    SELECT t.* FROM Tags t
                    INNER JOIN FileTag ft ON t.TagID = ft.TagID
                    WHERE ft.FileID = @fileID
                `);
            
            return result.recordset.map(row => new Tag(row.TagID, row.Name));
        } catch (error) {
            console.error('Error fetching tags for file:', error);
            throw error;
        } finally {
            await this.disconnect();
        }
    }

    // Retrieve all files associated with a specific tag
    async getFilesForTag(tagID) {
        try {
            await this.connect();
            const result = await this.pool.request()
                .input('tagID', sql.Int, tagID)
                .query(`
                    SELECT f.* FROM Files f
                    INNER JOIN FileTag ft ON f.FileID = ft.FileID
                    WHERE ft.TagID = @tagID
                `);
            return result.recordset; // Return a list of files
        } catch (error) {
            console.error('Error fetching files for tag:', error);
            throw error;
        } finally {
            await this.disconnect();
        }
    }
}

export default TagDAO;
