import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch()
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
    private readonly logger = new Logger(PrismaClientExceptionFilter.name, {
        timestamp: true,
    });

    catch(
        exception: Prisma.PrismaClientKnownRequestError,
        host: ArgumentsHost,
    ) {
        this.logger.error(
            'PrismaClientExceptionFilter ===>',
            exception.message,
        );

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const message = exception.message.replace(/\n/g, '');

        this.logger.error('PrismaClientExceptionFilter ===>', exception.code);
        switch (exception.code) {
            case 'P2002': {
                const status = HttpStatus.CONFLICT;
                response.status(status).json({
                    statusCode: status,
                    message: message,
                });
                break;
            }
            default:
                // default 500 error code
                super.catch(exception, host);
                break;
        }
    }
}
