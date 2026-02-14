import { Module } from '@nestjs/common';

import { DocumentsController } from './documents.controller';

@Module({
  imports: [],
  controllers: [DocumentsController],
  providers: [],
  exports: [],
})
export class DocumentsModule {}
