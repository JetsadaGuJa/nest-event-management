import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';
import { EmojiLogger } from './logger';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './response.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new EmojiLogger(),
    });

    app.useGlobalPipes(new ValidationPipe());

    app.useGlobalFilters(new HttpExceptionFilter());

    app.useGlobalInterceptors(new ResponseInterceptor());

    await app.listen(3000);
}
bootstrap();
