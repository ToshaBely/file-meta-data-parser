import { z } from 'zod';

import type { DocumentMetaData } from '../entities/document-meta-data.entity';
import {
  DOCUMENT_META_DATA_SORTABLE_KEYS,
  SORTING_ORDER_TYPES,
} from '../types/sorting.type';

export const searchDocumentsInputDtoSchema = z
  .object({
    documentMetaDataIds: z.array(z.uuid({ version: 'v4' })).optional(),
    caseNumbers: z.array(z.string()).optional(),
    titleSearchString: z.string().optional(),
    courtOrOfficeSearchString: z.string().optional(),
    decisionType: z.string().optional(),
    decisionMadeAtOrBefore: z.iso.date().optional(),
    decisionMadeAtOrAfter: z.iso.date().optional(),
    // the keys to sort the results by
    sortingKeys: z.array(z.enum(DOCUMENT_META_DATA_SORTABLE_KEYS)).optional(),
    // the order to sort the results by. Must be the same length as [sortingKeys]; one order per key
    sortingOrder: z.array(z.enum(SORTING_ORDER_TYPES)).optional(),
    offset: z.number().optional(),
    limit: z.number().optional(),
  })
  .strict()
  .refine(
    (data) =>
      (data.sortingKeys === undefined && data.sortingOrder === undefined) ||
      data.sortingKeys?.length === data.sortingOrder?.length,
    {
      message: 'The "sortingKeys" and "sortingOrder" are not of the same size',
      path: ['sortingKeys', 'sortingOrder'],
    },
  );

export type SearchDocumentsInputDto = z.infer<
  typeof searchDocumentsInputDtoSchema
>;

export class DocumentMetaDataResponseDto {
  readonly id: string;
  readonly title: string | null;
  readonly decisionType: string | null;
  // ISO date (YYYY-MM-DD)
  readonly dateOfDecision: string | null;
  readonly office: string | null;
  readonly court: string | null;
  readonly caseNumber: string | null;
  readonly summaryCase: string | null;
  readonly summaryConclusion: string | null;

  constructor(documentMetaDataEntity: DocumentMetaData) {
    this.id = documentMetaDataEntity.id;
    this.title = documentMetaDataEntity.title;
    this.decisionType = documentMetaDataEntity.decisionType;
    this.dateOfDecision = documentMetaDataEntity.dateOfDecision;
    this.office = documentMetaDataEntity.office;
    this.court = documentMetaDataEntity.court;
    this.caseNumber = documentMetaDataEntity.caseNumber;
    this.summaryCase = documentMetaDataEntity.summaryCase;
    this.summaryConclusion = documentMetaDataEntity.summaryConclusion;
  }
}

export type SearchDocumentsResponseDto = {
  data: DocumentMetaDataResponseDto[];
  pagination: {
    total: number;
    offset: number;
    limit: number;
  };
};
