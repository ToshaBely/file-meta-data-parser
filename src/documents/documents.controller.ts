import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { NotImplementedException } from '@nestjs/common/exceptions/not-implemented.exception';

@Controller('documents')
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
