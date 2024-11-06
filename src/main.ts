import {
    // HttpAdapterHost,
    NestFactory,
} from '@nestjs/core';
import { AppModule } from './app.module';
// import { HttpExceptionFilter } from './http-exception/http-exception.filter';
// import { EmojiLogger } from './logger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './response.interceptor';
import { ValidationError } from 'class-validator';
// import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';

function getAllConstraints(
    errors: ValidationError[],
    indexList?: number,
): any[] {
    const constraints: any[] = [];

    errors.map((error, index) => {
        {
            if (error.constraints) {
                const constraintValues = Object.values(error.constraints);
                constraints.push({
                    index: indexList || null,
                    field: error.property,
                    massage: constraintValues.join(','),
                });
            }

            if (error.children) {
                const childConstraints = getAllConstraints(
                    error.children,
                    index,
                );
                constraints.push(...childConstraints);
            }
        }
    });

    return constraints;
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {});
    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (errors) => {
                // console.log(
                //     'errorserrorserrorserrorserrors =>',
                //     JSON.stringify(errors),
                // );
                // const result = errors.map((error: any) => ({
                //     property: error.property,
                //     message:
                //         error.constraints[Object.keys(error.constraints)[0]],
                // }));
                return new BadRequestException(getAllConstraints(errors));
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
