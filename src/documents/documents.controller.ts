import {
  Controller,
  Get,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NotImplementedException } from '@nestjs/common/exceptions/not-implemented.exception';
import { FileInterceptor } from '@nestjs/platform-express';

import { RequiredResourcePermissions } from '../common/decorators/required-resource-permissions.decorator';

import { AuthGuard } from '../common/guards/auth.guard';
import { RequiredResourcePermissionsGuard } from '../common/guards/required-resource-permissions.guard';

import { OpenAiService } from '../open-ai/open-ai.service';

import { DocumentsService } from './documents.service';

import { parseDocumentMetadataFileValidators } from './utils/parse-document-metadata-file-validators';

@Controller('documents')
@UseGuards(AuthGuard)
@UseGuards(RequiredResourcePermissionsGuard)
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly openAiService: OpenAiService,
  ) {}

  @Get('')
  @RequiredResourcePermissions(['documents:read'])
  getAllDocuments() {
    throw new NotImplementedException();
  }

  @Get(':uuid')
  @RequiredResourcePermissions(['documents:read'])
  getDocumentById(
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    console.log('[getDocumentById]', id);
    throw new NotImplementedException();
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
    return await this.openAiService.parseLawCaseFileMetadata(fileTextContent);
  }
}
