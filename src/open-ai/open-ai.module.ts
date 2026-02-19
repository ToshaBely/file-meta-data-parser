import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ConsoleLoggerModule } from '../console-logger/console-logger.module';

import { OpenAiService } from './open-ai.service';

@Module({
  imports: [ConfigModule, ConsoleLoggerModule],
  controllers: [],
  providers: [OpenAiService],
  exports: [OpenAiService],
})
export class OpenAiModule {}
