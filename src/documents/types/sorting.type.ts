import { DocumentMetaData } from '../entities/document-meta-data.entity';

export const SORTING_ORDER_TYPES = ['ASC', 'DESC'] as const;
export type SortingOrderType = (typeof SORTING_ORDER_TYPES)[number];

export const DOCUMENT_META_DATA_SORTABLE_KEYS: Array<
  keyof Omit<
    DocumentMetaData,
    'summaryCase' | 'summaryConclusion' | 'deletedAt'
  >
> = [
  'id',
  'title',
  'decisionType',
  'dateOfDecision',
  'office',
  'court',
  'caseNumber',
  'createdAt',
] as const;

export type DocumentMetaDataSortableKey =
  (typeof DOCUMENT_META_DATA_SORTABLE_KEYS)[number];
