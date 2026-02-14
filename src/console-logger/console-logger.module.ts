import { Module } from '@nestjs/common';

import { ConsoleLoggerService } from './console-logger.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ConsoleLoggerService],
  exports: [ConsoleLoggerService],
})
export class ConsoleLoggerModule {}
