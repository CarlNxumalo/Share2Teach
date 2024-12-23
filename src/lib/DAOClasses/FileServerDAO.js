import { BlobServiceClient } from '@azure/storage-blob';
import { FILE_CON_STR } from '$env/static/private';
import { PDFDocument } from 'pdf-lib'; // For PDF manipulation
import fs from 'fs'; // For file system operations
//import * as fileType from 'file-type'; // Use this if you face import issues
import mammoth from 'mammoth'; // For DOCX to HTML conversion
//import puppeteer from 'puppeteer';
//import { exec } from 'child_process'; // For PPTX conversion
import { config } from 'dotenv';
config();

class FileServerDAO {
    constructor() {
        this.connectionString = FILE_CON_STR;
        this.containerName = 'files';
        this.blobServiceClient = null;
        this.containerClient = null;
    }

    async connect() {
        try {
            this.blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
            this.containerClient = this.blobServiceClient.getContainerClient(this.containerName);
            await this.containerClient.createIfNotExists();
            console.log('Connected to Azure Blob Storage');
        } catch (error) {
            console.error('Error connecting to Azure Blob Storage:', error);
            throw new Error('Could not connect to Azure Blob Storage');
        }
    }

    async uploadToBlobStorage(fileBuffer, fileName, contentType) {
        // Create a block blob client
        const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
        const options = { blobHTTPHeaders: { blobContentType: contentType } };
        // Upload data to the blob
        if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
            throw new Error('Invalid file buffer');
        }
        const uploadBlobResponse = await blockBlobClient.uploadData(fileBuffer, options);

        console.log(`Blob was uploaded successfully. Request ID: ${uploadBlobResponse.requestId}`);
    }

    async insertFile(file) {
        try {
            const type = await fileType.fromBuffer(file);
            if (!this.isSupportedFormat(type.ext)) {
                throw new Error('Unsupported file format. Supported formats: DOCX, PPTX, JPEG, PNG.');
            }

            const pdfBuffer = await this.convertToPDF(file, type.ext);
            const blobClient = this.containerClient.getBlobClient(`${file.name}.pdf`);
            const uploadBlobResponse = await blobClient.upload(pdfBuffer, pdfBuffer.length);
            return uploadBlobResponse;
        } catch (error) {
            console.error(`Error during file insertion: ${error.message}`);
            throw new Error(`Failed to upload file: ${error.message}`);
        }
    }

    isSupportedFormat(ext) {
        const supportedFormats = ['docx', 'pptx','pdf']; // Add more as needed
        return supportedFormats.includes(ext);
    }

    async convertToPDF(file, ext) {
        try {
            switch (ext) {
                case 'png':
                case 'jpeg':
                    return await this.convertImageToPDF(file);
                case 'docx':
                    return await this.convertDocxToPDF(file);
                case 'pptx':
                    return await this.convertPptxToPDF(file);
                default:
                    throw new Error('Unsupported file type for conversion.');
            }
        } catch (error) {
            console.error(`Error during conversion of ${ext}: ${error.message}`);
            throw new Error(`Failed to convert file: ${error.message}`);
        }
    }

    async convertImageToPDF(file) {
        try {
            const pdfDoc = await PDFDocument.create();
            const imgBytes = await fs.promises.readFile(file.path);
            const img = await pdfDoc.embedPng(imgBytes); // For PNG images
            const page = pdfDoc.addPage([img.width, img.height]);
            page.drawImage(img, {
                x: 0,
                y: 0,
                width: img.width,
                height: img.height,
            });
            const pdfBytes = await pdfDoc.save();
            return pdfBytes;
        } catch (error) {
            console.error(`Error converting image to PDF: ${error.message}`);
            throw new Error(`Image conversion failed: ${error.message}`);
        }
    }

    async convertDocxToPDF(file) {
        try {
            const docxBuffer = await fs.promises.readFile(file.path);
            const { value: html } = await mammoth.convertToHtml({ buffer: docxBuffer });

            // Use Puppeteer to generate PDF from HTML
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setContent(html);
            const pdfBuffer = await page.pdf({ format: 'A4' }); // You can customize the PDF options here
            await browser.close();

            return pdfBuffer;
        } catch (error) {
            console.error(`Error converting DOCX to PDF: ${error.message}`);
            throw new Error(`DOCX conversion failed: ${error.message}`);
        }
    }

  async convertPptxToPDF(file) {
        return new Promise((resolve, reject) => {
            const command = `libreoffice --headless --convert-to pdf --outdir ./output ${file.path}`;
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error converting PPTX to PDF: ${stderr}`);
                    return reject(new Error(`PPTX conversion failed: ${stderr}`));
                }
                const pdfPath = `./output/${file.name}.pdf`;
                fs.readFile(pdfPath, (err, data) => {
                    if (err) {
                        console.error(`Error reading converted PDF: ${err.message}`);
                        return reject(new Error(`Error reading converted PDF: ${err.message}`));
                    }
                    resolve(data);
                });
            });
        });
    }
    //works
    async deleteFile(filePath) {
        try {
            const blobClient = this.containerClient.getBlobClient(filePath);
            await blobClient.delete();
            return { message: 'File deleted successfully' };
        } catch (error) {
            throw new Error(`Failed to delete file: ${error.message}`);
        }
    }

    async updateFile(file) {
        try {
            const blobClient = this.containerClient.getBlobClient(file.getPath());
            const uploadBlobResponse = await blobClient.upload(file, file.getFileSize(), {
                blobHTTPHeaders: { blobContentType: file.getType() },
            });
            return uploadBlobResponse;
        } catch (error) {
            throw new Error(`Failed to update file: ${error.message}`);
        }
    }

    async readFile(filePath) {
        try {
            console.log(`Attempting to read blob from path: ${filePath}`);
            const blobClient = this.containerClient.getBlobClient(filePath);
            const downloadBlockBlobResponse = await blobClient.download(0);
            const downloadedData = await this.streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
            console.log(`Successfully read blob from path: ${filePath}`);
            return downloadedData;
        } catch (error) {
            console.error(`Error while reading blob from path: ${filePath}`, error);
            throw new Error(`Failed to read file: ${error.message}`);
        }
    }
    

    async setMetadata(filePath, metadata) {
        try {
            const blobClient = this.containerClient.getBlobClient(filePath);
            await blobClient.setMetadata(metadata);
            return { message: 'Metadata set successfully' };
        } catch (error) {
            throw new Error(`Failed to set metadata: ${error.message}`);
        }
    }

    async getMetadata(filePath) {
        try {
            const blobClient = this.containerClient.getBlobClient(filePath);
            const properties = await blobClient.getProperties();
            return properties.metadata;
        } catch (error) {
            throw new Error(`Failed to get metadata: ${error.message}`);
        }
    }

    async deleteMetadata(filePath, metadataKeys) {
        try {
            const blobClient = this.containerClient.getBlobClient(filePath);
            const currentMetadata = await blobClient.getProperties();
            const updatedMetadata = {};

            // Retain existing metadata except for the keys to be deleted
            for (const key in currentMetadata.metadata) {
                if (!metadataKeys.includes(key)) {
                    updatedMetadata[key] = currentMetadata.metadata[key];
                }
            }

            await blobClient.setMetadata(updatedMetadata);
            return { message: 'Metadata deleted successfully' };
        } catch (error) {
            throw new Error(`Failed to delete metadata: ${error.message}`);
        }
    }

    async streamToBuffer(readableStream) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            readableStream.on('data', (data) => {
                chunks.push(data);
            });
            readableStream.on('end', () => {
                resolve(Buffer.concat(chunks));
            });
            readableStream.on('error', reject);
        });
    }
}

export default FileServerDAO;
