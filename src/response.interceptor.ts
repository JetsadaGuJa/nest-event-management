import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    // HttpException,
    // HttpStatus,
    Logger,
} from '@nestjs/common';
import {
    Observable,
    //  throwError
} from 'rxjs';
import {
    // catchError,
    map,
} from 'rxjs/operators';
import { format } from 'date-fns';

export type Response<T> = {
    status: boolean;
    data: T;
    timestamp: string;
};

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    private readonly logger = new Logger(ResponseInterceptor.name, {
        timestamp: true,
    });
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        return next.handle().pipe(
            map((res: unknown) => this.responseHandler(res, context)),
            // catchError((err: HttpException) =>
            // throwError(() => this.errorHandler(err, context)),
            // ),
        );
    }

    // errorHandler(exception: HttpException, context: ExecutionContext) {
    //     const ctx = context.switchToHttp();
    //     const response = ctx.getResponse();

    //     const status =
    //         exception instanceof HttpException
    //             ? exception.getStatus()
    //             : HttpStatus.INTERNAL_SERVER_ERROR;
    //     this.logger.log(
    //         'responseHandler response!! ==>',
    //         response,
    //         exception,
    //         exception,
    //     );
    //     response.status(status).json({
    //         status: status,
    //         data: {},
    //         message: exception.message,
    //         timestamp: format(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss'),
    //     });
    // }

    responseHandler(res: any, context: ExecutionContext) {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const statusCode = response.statusCode;

        this.logger.log('responseHandler response!! ==>', response, res);

        return {
            status: statusCode,
            message: 'success',
            data: res,
            timestamp: format(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss'),
        };
    }
}
