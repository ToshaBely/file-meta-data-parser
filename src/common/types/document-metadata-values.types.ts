import { z } from 'zod';

export const documentMetadataValuesSchema = z
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

export type DocumentMetadataValues = z.infer<
  typeof documentMetadataValuesSchema
>;
