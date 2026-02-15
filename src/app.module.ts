import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { getDotEnvConfigFilePath } from './common/helpers/get-dot-env-config-file-path';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ConsoleLoggerModule } from './console-logger/console-logger.module';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getDotEnvConfigFilePath(),
    }),
    ConsoleLoggerModule,
    DocumentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
