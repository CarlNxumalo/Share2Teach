
import { json } from '@sveltejs/kit';
import FileDAO from '../../../lib/DAOClasses/FileDAO.js'; // Adjust as necessary
import File from '../../../lib/Classes/File.js';
import {FILE_CON_STR} from '$env/static/private'
import FileServerDAO from '$lib/DAOClasses/FileServerDAO.js';


//gets all the files in the database

/**
 * @swagger
 * tags:
 *   name: Files
 *   description: API for managing files
 */

/**
 * @swagger
 * /API/files:
 *   get:
 *     tags: [Files]
 *     summary: Retrieve all files
 *     responses:
 *       200:
 *         description: A list of files
 *       500:
 *         description: Internal Server Error
 */
export const GET = async ({url, locals}) => {
    console.log('GET request received');
    const fileDAO = new FileDAO();
    let files
    try {

        const fileName = url.searchParams.get('FileName')
        const bySubjectID = url.searchParams.get('SubjectID')
        const byFileTag = url.searchParams.get('TagID')
        //check if user it logged in to see all type of file
        
        await fileDAO.connect();
        const userID = locals.userID;
        
        if(userID){
            if(bySubjectID){
                files = await fileDAO.getFilesBySubject(bySubjectID)
            }
            else if(byFileTag){
                files = await fileDAO.getFilesByTag(byFileTag)
            }
            else if(fileName){
                files = await fileDAO.searchDocument(fileName)
            }
            else{
                files = await fileDAO.getAllFiles();
            }
        }
        else{
            if(bySubjectID){
                files = await fileDAO.getFilesBySubject2(bySubjectID)
            }
            else if(byFileTag){
                files = await fileDAO.getFilesByTag2(byFileTag)
            }
            else if(fileName){
                files = await fileDAO.searchDocument2(fileName)
            }
            else{
                files = await fileDAO.getAllApprovedFiles();
            }
        }


        console.log("runninggggg")
        return json(files, { status: 200, 
            headers: {
                'Access-Control-Allow-Origin': '*',  // Allow requests from any origin
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
        
    } catch (error) {
        console.error('Error fetching Documents:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await fileDAO.disconnect();
    }
};

/**
 * @swagger
 * /API/files:
 *   post:
 *     tags: [Files]
 *     summary: Upload a new file
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *                 description: The ID of the user uploading the file
 *               path:
 *                 type: string
 *                 description: The storage path of the file
 *               type:
 *                 type: string
 *                 description: The type of the file (e.g., pdf, docx)
 *               approvedAt:
 *                 type: string
 *                 format: date-time
 *                 description: The date the file was approved
 *               status:
 *                 type: string
 *                 description: The status of the file (e.g., active, inactive)
 *               report:
 *                 type: string
 *                 description: Any reports associated with the file
 *               grade:
 *                 type: string
 *                 description: The grade level associated with the file
 *               subjectID:
 *                 type: string
 *                 description: The ID of the subject related to the file
 *               fileSize:
 *                 type: integer
 *                 description: The size of the file in bytes
 *     responses:
 *       201:
 *         description: File created successfully
 *       400:
 *         description: Bad request due to invalid input
 *       500:
 *         description: Internal Server Error
 */
export async function POST({ request, locals }) {
    //upload the file to blob storage
    const formData = await request.formData(); // Parse the JSON body

    const fileDAO = new FileDAO();
    const doc = formData?.get('documents')
    console.log(doc)
    console.log("running entrries")
    console.log(formData.entries())

    if (!doc) {
        console.error('No file uploaded or file is missing in the form data');
        return json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await doc?.arrayBuffer());
    const fileName = doc?.name;
    const contentType = doc?.type;
    const fileSize = doc?.size; 
    console.log("running buffer")
    console.log(fileBuffer)
    console.log("We have the user ID logged in: "+locals.userID)
    
    try {
        await fileDAO.connect(); // Ensure you connect to the database
        var file = new File(
            Number(locals.userID),
            formData.get('path'),
            doc?.type,
            null,
            'pending',
            formData.get('report'),
            formData.get('grade'),
            Number(formData.get('subjectID')),
            fileSize 
        );
        //console.log(file)
        await fileDAO.uploadFile(file);

        const fileServer = new FileServerDAO();
        await fileServer.connect();
        await fileServer.uploadToBlobStorage(fileBuffer, formData.get('path'), contentType)

        return json({ message: 'File created successfully' }, { 
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Local address
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });

    } catch (error) {
        console.error('Error creating File:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    } 

}


export async function PUT({ request }) {
    try {
        const fileDAO = new FileDAO();
        const DATA = await request.json(); 
        console.log(DATA)
         let fileO = new File(
            DATA.userID, DATA.path,DATA.type,DATA.approvedAt, DATA.status,
            DATA.report, DATA.grade, DATA.subjectID,DATA.fileSize, DATA.fileID);
        // Input validation
        if (!fileO.fileID || !fileO.report) {
            return json({ error: 'Missing fileId or reportReason' }, { status: 400 });
        }
       const report =  await fileDAO.reportFile(fileO.fileID, fileO.report);
        
        return json({ report: "File updated succesfully" });
    } catch (error) {
        console.error('Error reporting file:', error);
        return json({ error: 'Failed to report file' }, { status: 500 });
    }
};


export async function OPTIONS() {
    console.log("Options ran")
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*', // Local address
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
};


  

