import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvalidPDFException, PDFParse } from 'pdf-parse';

import {
  MIMETYPE_HTML,
  MIMETYPE_PDF,
} from '../common/constants/files.constants';
import { DocumentMetaData } from './entities/document-meta-data.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentMetaData)
    private readonly documentMetaDataRepository: Repository<DocumentMetaData>,
  ) {}

  async getAllDocumentsMetaData(): Promise<DocumentMetaData[]> {
    return this.documentMetaDataRepository.find();
  }

  async getDocumentMetaDataById(uuid: string): Promise<DocumentMetaData> {
    const docMetaData = await this.documentMetaDataRepository.findOneBy({
      id: uuid,
    });

    if (!docMetaData) {
      throw new NotFoundException(
        `Document meta data with id "${uuid}" not found.`,
      );
    }

    return docMetaData;
  }

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
