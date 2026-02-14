import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

import { ConsoleLoggerService } from '../../console-logger/console-logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: ConsoleLoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // todo: later we can introduce more sophisticated logging / observability system
    //  e.g. to write logs to the DB or to the Observability tool(s) + provide a custom context, not just arguments
    this.loggerService.info(`Start request: [${req.method}] "${req.url}"`);
    next();
  }
}
