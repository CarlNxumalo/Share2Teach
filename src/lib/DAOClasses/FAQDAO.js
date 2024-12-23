import sql from 'mssql';
import FAQ from '../../lib/Classes/FAQ.js';

class FAQDAO {
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

    async getAllFAQs() {
        try {
            const result = await this.pool.request().query('SELECT * FROM FAQ');
            
            // Map the recordset to match the required format
            const faqs = result.recordset.map(row => new FAQ(
                row.FAQ_ID,     
                row.Question,   
                row.Answer      
            ));
    
            
            return faqs;
        } catch (error) {
            console.error('Failed to retrieve FAQs:', error);
            throw error;
        }
    }
    

    async getFAQById(id) {
        try {
            const result = await this.pool.request()
                .input('id', sql.Int, id)
                .query('SELECT * FROM FAQ WHERE FAQ_ID = @id;');
            if (result.recordset.length > 0) {
                const row = result.recordset[0];
                return new FAQ(row.FAQ_ID, row.Question, row.Answer);
            } else {
                return null;
            }
        } catch (error) {
            console.error('Failed to retrieve FAQ by ID:', error);
            throw error;
        }
    }

    async createFAQ(faq) {
        try {
            await this.pool.request()
                .input('question', sql.NVarChar, faq.Question) // Use the exact property name
                .input('answer', sql.NVarChar, faq.Answer)
                .query(`
                    INSERT INTO FAQ (Question, Answer)
                    VALUES (@question, @answer);
                `);
        } catch (error) {
            console.error('Failed to create FAQ:', error);
            throw error;
        }
    }
    
    
    

    async updateFAQ(faq) {
        try {
            const result = await this.pool.request()
                .input('id', sql.Int, faq.FAQ_ID)
                .input('question', sql.NVarChar, faq.Question)
                .input('answer', sql.NVarChar, faq.Answer)
                .query('UPDATE FAQ SET Question = @question, Answer = @answer WHERE FAQ_ID = @id');
    
            return result.rowsAffected[0] > 0; // Returns true if a row was updated
        } catch (error) {
            console.error('Failed to update FAQ:', error);
            throw error;
        }
    }
    

    async deleteFAQ(id) {
        try {
            const result = await this.pool.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM FAQ WHERE FAQ_ID = @id');
            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error('Failed to delete FAQ:', error);
            throw error;
        }
    }
}

export default FAQDAO;