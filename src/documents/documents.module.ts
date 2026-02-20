import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OpenAiModule } from '../open-ai/open-ai.module';

import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { DocumentMetaData } from './entities/document-meta-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentMetaData]), OpenAiModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [],
})
export class DocumentsModule {}
