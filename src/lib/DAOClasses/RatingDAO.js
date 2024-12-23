import sql from 'mssql';
import Rating from '../../lib/Classes/Rating.js';

class RatingDAO {
    constructor() {
        this.connectionString = "Server=tcp:share2teach-server.database.windows.net,1433;Initial Catalog=Share2Teach;Persist Security Info=False;User ID=admin-server;Password=share2teach#IT;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";
    }

    async connect() {
        try {
            this.pool = await sql.connect(this.connectionString);
        } catch (error) {
            console.error('Failed to connect to the database:', error);
            throw error;
        }
    }

    async disconnect() {
        try {
            await this.pool.close(); 
        } catch (error) {
            console.error('Failed to close the database connection:', error);
        }
    }

    async addRating(rating) {
        try {
            const query = `
                INSERT INTO Rating (rate, fileID)
                VALUES (@rate, @fileID);
            `;
            const result = await this.pool.request()
                .input('rate', sql.Int, rating.rate)
                .input('fileID', sql.Int, rating.fileID)
                .query(query);
            return result.rowsAffected[0] === 1; // Returns true if one row was affected (inserted)
        } catch (error) {
            console.error('Error adding rating:', error);
            throw error;
        }
    }
    
    async getRatingById(ratingID) {
        try {
            const query = `
                SELECT * FROM Rating WHERE RatingID = @ratingID;
            `;
            const result = await this.pool.request()
                .input('ratingID', sql.Int, ratingID)
                .query(query);
            
            if (result.recordset.length > 0) {
                const row = result.recordset[0];
                return {
                    ratingID: row.RatingID,
                    rate: row.Rate,
                    fileID: row.FileID
                };
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error retrieving rating by ID:', error);
            throw error;
        }
    }

   
    async updateRating(rating) {
        try {
            const result = await this.pool.request()
                .input('id', sql.Int, rating.ratingID)
                .input('rating', sql.Int, rating.rate)
                .input('fileID', sql.Int, rating.fileID)
                .query('UPDATE Rating  SET Rate = @rating, FileID = @fileID WHERE RatingID = @id');
            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error('Failed to update Rating:', error);
            throw error;
        }
    }

    async deleteRating(ratingID) {
        try {
            const result = await this.pool.request()
                .input('id', sql.Int, ratingID)
                .query('DELETE FROM Rating WHERE RatingID = @id');
            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error('Failed to delete Rating:', error);
            throw error;
        }
    }

async getAverageRating(fileID) {
    try {
        const query = `
            SELECT AVG(rate) AS averageRate FROM Rating WHERE fileID = @fileID;
        `;
        const result = await this.pool.request()
            .input('fileID', sql.Int, fileID)
            .query(query);
        
        if (result.recordset.length > 0) {
            return result.recordset[0].averageRate; // Return the average rating
        } else {
            return null; // No ratings found
        }
    } catch (error) {
        console.error('Error retrieving average rating:', error);
        throw error;
    }
}
}

export default RatingDAO;