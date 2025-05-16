
import Tesseract from 'tesseract.js';
import * as pdfjs from 'pdfjs-dist';

// Define the OcrResult interface to ensure type safety
export interface OcrResult {
  success: boolean;
  text: string;
  processingTime: number;
}

/**
 * Extract text from an image file using OCR
 */
const extractTextFromImage = async (file: File): Promise<string> => {
  const result = await Tesseract.recognize(
    file,
    'eng', // English language
    { logger: m => console.log(m) }
  );
  return result.data.text;
};

/**
 * Extract text from a PDF file
 */
const extractTextFromPdf = async (file: File): Promise<string> => {
  // Set up the worker without dynamic import
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    // In a Vite environment, we can use the CDN version of the worker
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  
  // Extract text from each page
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + ' ';
  }
  
  return fullText;
};

/**
 * Process a file with OCR and check if the specified number exists in the text
 */
export const processFile = async (file: File, numberToFind: string): Promise<OcrResult> => {
  const startTime = performance.now();
  let extractedText = '';
  
  try {
    if (file.type === 'application/pdf') {
      extractedText = await extractTextFromPdf(file);
    } else if (file.type.startsWith('image/')) {
      extractedText = await extractTextFromImage(file);
    } else {
      throw new Error('Unsupported file type');
    }
    
    const endTime = performance.now();
    const processingTime = (endTime - startTime) / 1000; // Convert to seconds
    
    // Check if the number exists in the extracted text
    const success = extractedText.includes(numberToFind);
    
    return {
      success,
      text: extractedText,
      processingTime,
    };
  } catch (error) {
    console.error('OCR processing error:', error);
    const endTime = performance.now();
    const processingTime = (endTime - startTime) / 1000;
    
    return {
      success: false,
      text: 'Error processing file',
      processingTime,
    };
  }
};
