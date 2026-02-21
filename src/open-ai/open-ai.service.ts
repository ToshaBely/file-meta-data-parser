import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { z } from 'zod';

import type { DocumentMetadataValues } from '../common/types/document-metadata-values.types';
import {
  documentMetadataParsedValuesSchema,
  translateDocumentMetadataParsedValues,
} from '../common/types/document-metadata-values.types';

import { ConsoleLoggerService } from '../console-logger/console-logger.service';

import {
  PARSE_FILE_METADATA_INSTRUCTION_PROMPT,
  PARSE_FILE_METADATA_PROMPT_JSON_SCHEMA,
  PARSE_FILE_METADATA_USER_PROMPT,
} from './prompts/parse-file-metadata-instruction.prompt';

const OPENAI_API_KEY_ENV_VAR_NAME = 'OPENAI_API_KEY';

@Injectable()
export class OpenAiService {
  private readonly openAiClient: OpenAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: ConsoleLoggerService,
  ) {
    this.openAiClient = new OpenAI({
      apiKey: this.configService.get(OPENAI_API_KEY_ENV_VAR_NAME),
    });
  }

  async parseLawCaseFileMetadata(
    fileTextContent: string,
  ): Promise<DocumentMetadataValues> {
    try {
      const response = await this.openAiClient.responses.create({
        // usually it's better to "pin" a specific model snapshot to have more consistent results with the same input
        model: 'gpt-4.1-mini-2025-04-14',
        // lower temperature makes the model less creative and more doc based:
        // 0 - minimises creative inference; 0.1-0.3 - for analytical tasks
        temperature: 0.1,
        input: [
          {
            role: 'system',
            content: [
              {
                type: 'input_text',
                text: PARSE_FILE_METADATA_INSTRUCTION_PROMPT,
              },
            ],
          },
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: PARSE_FILE_METADATA_USER_PROMPT,
              },
            ],
          },
          // todo: it would be nice to add a "security instruction" to stop the execution if the model can see
          //  any attempt of manipulation (such as "forget all the previous instructions and do X")
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: `The file content is:\n${fileTextContent}`,
              },
            ],
          },
        ],
        text: { format: PARSE_FILE_METADATA_PROMPT_JSON_SCHEMA },
      });

      if (response.status !== 'completed') {
        // separately we can handle a specific edge case - not just generic "!== completed"
        // "Handling edge cases" doc: https://developers.openai.com/api/docs/guides/structured-outputs?lang=javascript#json-mode
        this.loggerService.warn(
          `[parseLawCaseFileMetadata] OpenAI response status is not "completed": response.status="${response.status}"`,
        );
        throw new Error('OpenAI response status is not "completed"');
      }

      // idea: separately we might check for "null" values and send a notification (warn) in the team monitoring services
      const documentMetaDataResponse = documentMetadataParsedValuesSchema.parse(
        JSON.parse(response.output_text),
      );

      return translateDocumentMetadataParsedValues(documentMetaDataResponse);
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        // in a real case scenario we could target some specific error(s), e.g. 429 (RateLimitError)
        this.loggerService.warn(
          `[parseLawCaseFileMetadata] OpenAI API Error: request_id="${error.requestID}", status="${error.status} (${error.name})`,
        );
      }

      if (error instanceof z.ZodError) {
        // notify the team that our prompt needs some love,
        // because it returns not a parsable JSON as it was expected
      }

      throw error;
    }
  }
}
