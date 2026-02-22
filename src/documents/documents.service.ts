import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { InvalidPDFException, PDFParse } from 'pdf-parse';

import {
  MIMETYPE_HTML,
  MIMETYPE_PDF,
} from '../common/constants/files.constants';
import type { DocumentMetadataValues } from '../common/types/document-metadata-values.types';

import { DocumentMetaData } from './entities/document-meta-data.entity';
import type {
  SearchDocumentsInputDto,
  SearchDocumentsResponseDto,
} from './dto/search-documents.dto';
import { DocumentMetaDataResponseDto } from './dto/search-documents.dto';
import type {
  DocumentMetaDataSortableKey,
  SortingOrderType,
} from './types/sorting.type';
import { appendOrderByClause } from './utils/append-order-by-clause.helper';

const DOCUMENT_META_DATA_ALIAS = 'documentMetaData';

const DEFAULT_SORTING_KEY: DocumentMetaDataSortableKey = 'createdAt';
const DEFAULT_SORTING_ORDER: SortingOrderType = 'DESC';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentMetaData)
    private readonly documentMetaDataRepository: Repository<DocumentMetaData>,
  ) {}

  async insertDocumentMetaData(documentMetadataValues: DocumentMetadataValues) {
    await this.documentMetaDataRepository.insert({
      title: documentMetadataValues.title,
      decisionType: documentMetadataValues.decisionType,
      dateOfDecision: documentMetadataValues.dateOfDecision,
      office: documentMetadataValues.office,
      court: documentMetadataValues.court,
      caseNumber: documentMetadataValues.caseNumber,
      summaryCase: documentMetadataValues.summaryCase,
      summaryConclusion: documentMetadataValues.summaryConclusion,
    });
  }

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

  async getDocumentMetaDataByFilter({
    documentMetaDataIds,
    caseNumbers,
    titleSearchString,
    courtOrOfficeSearchString,
    decisionType,
    decisionMadeAtOrBefore,
    decisionMadeAtOrAfter,
    sortingKeys,
    sortingOrder,
    offset = 0,
    limit = 10,
  }: SearchDocumentsInputDto): Promise<SearchDocumentsResponseDto> {
    const queryBuilder = this.documentMetaDataRepository.createQueryBuilder(
      DOCUMENT_META_DATA_ALIAS,
    );

    queryBuilder.where(`${DOCUMENT_META_DATA_ALIAS}.deletedAt IS NULL`);
    queryBuilder.limit(limit).offset(offset);

    if (documentMetaDataIds?.length) {
      queryBuilder.andWhere(
        `${DOCUMENT_META_DATA_ALIAS}.id IN (:...documentMetaDataIds)`,
        {
          documentMetaDataIds,
        },
      );
    }

    if (caseNumbers?.length) {
      queryBuilder.andWhere(
        `${DOCUMENT_META_DATA_ALIAS}.caseNumber IN (:...caseNumbers)`,
        {
          caseNumbers,
        },
      );
    }

    if (titleSearchString) {
      queryBuilder.andWhere(`${DOCUMENT_META_DATA_ALIAS}.title ILIKE :title`, {
        title: `%${titleSearchString}%`,
      });
    }

    if (courtOrOfficeSearchString) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(`${DOCUMENT_META_DATA_ALIAS}.office ILIKE :office`, {
            office: `%${courtOrOfficeSearchString}%`,
          }).orWhere(`${DOCUMENT_META_DATA_ALIAS}.court ILIKE :court`, {
            court: `%${courtOrOfficeSearchString}%`,
          });
        }),
      );
    }

    if (decisionType) {
      queryBuilder.andWhere(
        `${DOCUMENT_META_DATA_ALIAS}.decisionType = :decisionType`,
        {
          decisionType,
        },
      );
    }

    if (decisionMadeAtOrBefore) {
      queryBuilder
        .andWhere(`${DOCUMENT_META_DATA_ALIAS}.dateOfDecision IS NOT NULL`)
        .andWhere(
          `${DOCUMENT_META_DATA_ALIAS}.dateOfDecision <= :decisionMadeAtOrBefore`,
          {
            decisionMadeAtOrBefore,
          },
        );
    }

    if (decisionMadeAtOrAfter) {
      queryBuilder
        .andWhere(`${DOCUMENT_META_DATA_ALIAS}.dateOfDecision IS NOT NULL`)
        .andWhere(
          `${DOCUMENT_META_DATA_ALIAS}.dateOfDecision >= :decisionMadeAtOrAfter`,
          {
            decisionMadeAtOrAfter,
          },
        );
    }

    appendOrderByClause({
      selectQueryBuilder: queryBuilder,
      entityAlias: DOCUMENT_META_DATA_ALIAS,
      sortingKeys: sortingKeys ?? [DEFAULT_SORTING_KEY],
      sortingOrder: sortingOrder ?? [DEFAULT_SORTING_ORDER],
    });

    const [queryResult, total] = await queryBuilder.getManyAndCount();

    return {
      data: queryResult.map(
        (docMetaDataEntity) =>
          new DocumentMetaDataResponseDto(docMetaDataEntity),
      ),
      pagination: {
        total,
        offset,
        limit,
      },
    };
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
