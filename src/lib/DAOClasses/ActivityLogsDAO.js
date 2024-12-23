import { testConnection } from './DatabaseConnection.js';
import ActivityLogs from '../../lib/Classes/ActivityLogs.js';
import sql from 'mssql';

class ActivityLogsDAO {


    async logActivity(activity) {
        let connection;
        try {
              
            connection = await testConnection(); // Database connection
    
            const query = `
                INSERT INTO ACTIVITY_LOGS (TimeStamp, activity_type, activity_description,date_created)
                VALUES (@TimeStamp, @ActivityType, @ActivityDescription,@datecreated)
            `;
    
            const result = await connection.request()
                .input('TimeStamp',sql.Time, activity.TimeStamp)  // Use the fetched userId
                .input('ActivityType',sql.NVarChar, activity.activity_type)
                .input('ActivityDescription',sql.NVarChar ,activity.activity_description)
                .input('datecreated',sql.DateTime ,activity.date_created)
                .query(query);

               
    
            console.log('Activity log saved successfully');
        } catch (err) {
            console.error('Failed to log activity:', err);
            throw new Error('Failed to log activity');
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }
    

    async getAllActivityLogs() {
        let connection;
        try {
            connection = await testConnection(); // Database connection
            const query = `SELECT * FROM ACTIVITY_LOGS`;
            const result = await connection.request().query(query);
            return result.recordset; // Return the array of logs
        } catch (err) {
            console.error('Failed to fetch activity logs:', err);
        } finally {
            if (connection) {
                await connection.close(); // Close the connection
            }
        }
    }

    async getActivityLogsByUserId(userId) {
        let connection;
        try {
            connection = await testConnection();
            const query = `SELECT * FROM ACTIVITY_LOGS WHERE UserID = @userId`;
            const result = await connection.request()
                .input('userId', sql.Int, userId)
                .query(query);
            return result.recordset; // Return the logs for that user
        } catch (err) {
            console.error('Failed to fetch activity logs for user:', err);
            throw err;
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    
    
    

    async deleteActivityLog(logId) {
        let connection;
        try {
            connection = await testConnection();
            const query = `DELETE FROM ACTIVITY_LOGS WHERE ActivityLogs_ID = @logId`;
            await connection.request()
                .input('logId', sql.Int, logId)
                .query(query);
            console.log('Activity log deleted successfully');
        } catch (err) {
            console.error('Failed to delete activity log:', err);
            throw err;
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }
    
 
    
}

export default ActivityLogsDAO;




