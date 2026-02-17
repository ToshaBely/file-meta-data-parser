import { Injectable } from '@nestjs/common';
import { InvalidPDFException, PDFParse } from 'pdf-parse';

import {
  MIMETYPE_HTML,
  MIMETYPE_PDF,
} from '../common/constants/files.constants';

@Injectable()
export class DocumentsService {
  async getFileTextContent(file: Express.Multer.File): Promise<string> {
    switch (file.mimetype) {
      case MIMETYPE_HTML: {
        return file.buffer.toString();
      }
      case MIMETYPE_PDF: {
        const parser = new PDFParse({ data: file.buffer });

        try {
          const pdfTextContent = await parser.getText();

          return pdfTextContent.text;
        } catch (error) {
          if (error instanceof InvalidPDFException) {
            // we can handle some specific error gracefully
            // with a nice error message provided to a client
          }

          throw error;
        } finally {
          await parser.destroy();
        }
      }
      default: {
        throw new Error('Not supported file mimetype');
      }
    }
  }
}
