import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { NotImplementedException } from '@nestjs/common/exceptions/not-implemented.exception';

import { RequiredResourcePermissions } from '../common/decorators/required-resource-permissions.decorator';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('documents')
@UseGuards(AuthGuard)
export class DocumentsController {
  constructor() {}

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
  @RequiredResourcePermissions(['documents:admin'])
  createDocument() {
    throw new NotImplementedException();
  }
}
