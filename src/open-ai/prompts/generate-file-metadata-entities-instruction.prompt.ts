import type OpenAI from 'openai';

export const GENERATE_FILE_METADATA_ENTITIES_INSTRUCTION_PROMPT = `## Task description
Based on the task description and instruction given in the next instruction messages,
your task is to generate mock records that could be added to the local database for demo purposes to show the functionality of the service.

## Guidelines
Always return data in JSON format strictly following the "Expected output format (JSON)" section. It must be an array of document metadata entities. 

The example of a returned result:
[
  {
    "title": "Judgment of the Court (Sixth Chamber) in Case C-723/23 [Amilla]",
    "decision_type": "Judgment",
    "date_of_decision": "2025-04-10",
    "office": "Sixth Chamber",
    "court": "Court of Justice of the European Union",
    "case_number": "C-723/23",
    "summary_case": "The case concerns a request for a ...",
    "summary_conclusion": "The Court held that Article 23(1) of Directive 2019/1023 does not preclude national legislation excluding access to discharge of debt ..."
  }
]
`;

export const GENERATE_FILE_METADATA_ENTITIES_PROMPT_JSON_SCHEMA: OpenAI.Responses.ResponseFormatTextConfig =
  {
    type: 'json_schema',
    name: 'case_law_metadata_generated',
    schema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        recordList: {
          type: 'array',
          items: {
            $ref: '#/$defs/recordItem',
          },
        },
      },
      required: ['recordList'],
      $defs: {
        recordItem: {
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
      },
    },
  };
