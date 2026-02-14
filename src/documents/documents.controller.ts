import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { NotImplementedException } from '@nestjs/common/exceptions/not-implemented.exception';

import { AuthGuard } from '../common/guards/auth.guard';

@Controller('documents')
@UseGuards(AuthGuard)
export class DocumentsController {
  constructor() {}

  @Get('')
  getAllDocuments() {
    throw new NotImplementedException();
  }

  @Get(':uuid')
  getDocumentById(
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    console.log('[getDocumentById]', id);
    throw new NotImplementedException();
  }

  @Post('metadata\\:parse')
  createDocument() {
    throw new NotImplementedException();
  }
}
