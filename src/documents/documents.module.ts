import { Module } from '@nestjs/common';

import { OpenAiModule } from '../open-ai/open-ai.module';

import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';

@Module({
  imports: [OpenAiModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [],
})
export class DocumentsModule {}
