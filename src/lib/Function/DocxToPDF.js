import fs from 'fs';
import mammoth from 'mammoth';
import puppeteer from 'puppeteer';

// Function to convert DOCX to HTML using mammoth
async function convertDocxToHtml(docxFilePath) {
    const result = await mammoth.convertToHtml({path: docxFilePath});
    return result.value; // The converted HTML content
}

// Function to convert HTML to PDF using puppeteer
async function convertHtmlToPdf(htmlContent, pdfFilePath) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set the HTML content
    await page.setContent(htmlContent);

    // Save the PDF
    await page.pdf({ path: pdfFilePath, format: 'A4' });

    await browser.close();
}

// Main function to perform the conversion
async function convertDocxToPdf(docxFilePath, pdfFilePath) {
    const htmlContent = await convertDocxToHtml(docxFilePath);
    await convertHtmlToPdf(htmlContent, pdfFilePath);
    console.log(`PDF generated at: ${pdfFilePath}`);
}

// Example usage
const docxFilePath = 'your-file.docx';
const pdfFilePath = 'output-file.pdf';

convertDocxToPdf(docxFilePath, pdfFilePath)
    .catch(err => console.error("Error during conversion:", err));
