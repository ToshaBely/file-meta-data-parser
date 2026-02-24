import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { RequiredResourcePermissions } from '../common/decorators/required-resource-permissions.decorator';

import { AuthGuard } from '../common/guards/auth.guard';
import { RequiredResourcePermissionsGuard } from '../common/guards/required-resource-permissions.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

import { OpenAiService } from '../open-ai/open-ai.service';

import { DocumentsService } from './documents.service';
import type {
  SearchDocumentsInputDto,
  SearchDocumentsResponseDto,
} from './dto/search-documents.dto';
import { searchDocumentsInputDtoSchema } from './dto/search-documents.dto';
import { parseDocumentMetadataFileValidators } from './utils/parse-document-metadata-file-validators';

@Controller('documents')
@UseGuards(AuthGuard)
@UseGuards(RequiredResourcePermissionsGuard)
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly openAiService: OpenAiService,
  ) {}

  @Get(':uuid')
  @RequiredResourcePermissions(['documents:read'])
  getDocumentById(
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string,
  ) {
    return this.documentsService.getDocumentMetaDataById(uuid);
  }

  @Post('metadata\\:search')
  @HttpCode(HttpStatus.OK)
  @RequiredResourcePermissions(['documents:read'])
  @UsePipes(new ZodValidationPipe(searchDocumentsInputDtoSchema))
  searchDocuments(
    @Body() searchDocumentsInputDto: SearchDocumentsInputDto,
  ): Promise<SearchDocumentsResponseDto> {
    return this.documentsService.getDocumentMetaDataByFilter(
      searchDocumentsInputDto,
    );
  }

  @Post('metadata\\:parse')
  @UseInterceptors(FileInterceptor('file'))
  @RequiredResourcePermissions(['documents:admin'])
  async parseDocumentMetadata(
    @UploadedFile(
      new ParseFilePipe({ validators: parseDocumentMetadataFileValidators }),
    )
    file: Express.Multer.File,
  ) {
    const fileTextContent =
      await this.documentsService.getFileTextContent(file);

    const documentMetadataValues =
      await this.openAiService.parseLawCaseFileMetadata(fileTextContent);

    await this.documentsService.insertDocumentMetaData(documentMetadataValues);

    return documentMetadataValues;
  }
}
