import {
    // HttpAdapterHost,
    NestFactory,
} from '@nestjs/core';
import { AppModule } from './app.module';
// import { HttpExceptionFilter } from './http-exception/http-exception.filter';
// import { EmojiLogger } from './logger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './response.interceptor';
// import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {});

    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (errors) => {
                // const result = errors.map((error: any) => ({
                //     property: error.property,
                //     message:
                //         error.constraints[Object.keys(error.constraints)[0]],
                // }));
                return new BadRequestException(errors);
            },
            stopAtFirstError: true,
        }),
    );

    // const { httpAdapter } = app.get(HttpAdapterHost);
    // app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

    app.enableCors();

    app.useGlobalInterceptors(new ResponseInterceptor());

    await app.listen(3000);
}
bootstrap();
