import { z } from 'zod';

export const documentMetadataParsedValuesSchema = z
  .object({
    title: z.string().nullable(),
    decision_type: z.string().nullable(),
    date_of_decision: z.iso.date().nullable(),
    office: z.string().nullable(),
    court: z.string().nullable(),
    case_number: z.string().nullable(),
    summary_case: z.string().nullable(),
    summary_conclusion: z.string().nullable(),
  })
  .strict();

export type DocumentMetadataParsedValues = z.infer<
  typeof documentMetadataParsedValuesSchema
>;

export type DocumentMetadataValues = {
  title: string | null;
  decisionType: string | null;
  dateOfDecision: string | null;
  office: string | null;
  court: string | null;
  caseNumber: string | null;
  summaryCase: string | null;
  summaryConclusion: string | null;
};

export function translateDocumentMetadataParsedValues(
  parsedValues: DocumentMetadataParsedValues,
): DocumentMetadataValues {
  return {
    title: parsedValues.title,
    decisionType: parsedValues.decision_type,
    dateOfDecision: parsedValues.date_of_decision,
    office: parsedValues.office,
    court: parsedValues.court,
    caseNumber: parsedValues.case_number,
    summaryCase: parsedValues.summary_case,
    summaryConclusion: parsedValues.summary_conclusion,
  };
}
