import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
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

import { MAX_EXPECTED_CASE_LAW_FILE_SIZE } from '../common/constants/files.constants';
import { DocumentsService } from './documents.service';

@Controller('documents')
@UseGuards(AuthGuard)
@UseGuards(RequiredResourcePermissionsGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

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
  parseDocumentMetadata(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /^(text\/html|application\/pdf)$/i,
            // more info about "magic numbers" and default to mimetype:
            // https://stackoverflow.com/questions/79792873/validating-file-type-by-nestjs-with-uploadedfile-decorator
            fallbackToMimetype: true,
            errorMessage: 'Validation failed - Expected file: HTML or PDF',
          }),
          new MaxFileSizeValidator({
            maxSize: MAX_EXPECTED_CASE_LAW_FILE_SIZE,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // first step is to distill the text content from the file
    // it's going to be used in future steps
    return this.documentsService.getFileTextContent(file);
  }
}
