import { Injectable } from '@nestjs/common';

const LOG_PREFIX = '[Console Logger Service]';

@Injectable()
export class ConsoleLoggerService {
  info(...args: unknown[]) {
    console.info(LOG_PREFIX, ...args);
  }

  warn(...args: unknown[]) {
    console.warn(LOG_PREFIX, ...args);
  }
}
