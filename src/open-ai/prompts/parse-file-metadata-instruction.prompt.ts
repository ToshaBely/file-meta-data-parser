import type OpenAI from 'openai';

export const PARSE_FILE_METADATA_INSTRUCTION_PROMPT = `## Task description
You are a legal document parser. Your task is to parse the text content of a given case law document in order to obtain its metadata following the extraction rules.
Extract metadata only if explicitly stated. Do not infer or guess. Return null if unclear.
The file content will be provided in the following piece of user's content.

You need to extract the following meta data:
- title;
- decision type;
- date of decision;
- office;
- court;
- case number;
- a summary of the case;
- a summary of the case conclusion;

## Guidelines
Always return data in JSON format strictly following the "Expected output format (JSON)" section.

For each metadata field, use only explicit statements in the document itself.
You may use HTML structure (titles, headings, navigation elements) as explicit statements.

### Date of decision
1. Use the date stated in the document header, title block, or summary;
2. If multiple dates exist, choose the date explicitly labeled as “Judgment”, “Decision”, or equivalent;
3. Do NOT use dates appearing in citations, footnotes, reasoning, or references to other cases;
4. If no explicit decision date exists, return null;

### Court
- Accept the judicial or quasi-judicial body that issued the decision;
- This includes courts, tribunals, boards, or administrative appeals bodies (e.g. Klagenævn, Fredningsnævn);
- The body must be explicitly named as deciding or issuing the present case;
- Do not require the literal word “court”;
- If no separate court is stated, use the issuing decision body;

For each extracted field, identify the exact section of the document it was taken from.
If the field cannot be located unambiguously, return null instead of inferring.`;

export const PARSE_FILE_METADATA_USER_PROMPT = `Parse the attached case law document's text content and extract the required metadata following the extraction rules.
The file content will be provided in the following piece of user's content`;

export const PARSE_FILE_METADATA_PROMPT_JSON_SCHEMA: OpenAI.Responses.ResponseFormatTextConfig =
  {
    type: 'json_schema',
    name: 'case_law_metadata',
    schema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        title: { type: ['string', 'null'] },
        decision_type: { type: ['string', 'null'] },
        date_of_decision: {
          type: ['string', 'null'],
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
          description:
            'The date of decision follows a common date pattern YYYY-MM-DD (ISO date format)',
        },
        office: { type: ['string', 'null'] },
        court: { type: ['string', 'null'] },
        case_number: { type: ['string', 'null'] },
        summary_case: { type: ['string', 'null'] },
        summary_conclusion: { type: ['string', 'null'] },
      },
      required: [
        'title',
        'decision_type',
        'date_of_decision',
        'office',
        'court',
        'case_number',
        'summary_case',
        'summary_conclusion',
      ],
    },
  };
