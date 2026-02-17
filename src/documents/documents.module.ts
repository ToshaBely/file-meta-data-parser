import { Module } from '@nestjs/common';

import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';

@Module({
  imports: [],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [],
})
export class DocumentsModule {}
