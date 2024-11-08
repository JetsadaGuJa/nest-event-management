import {
    BadRequestException,
    HttpStatus,
    Injectable,
    Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
    createEventDto,
    createEventDtoList,
    filterEvent,
    search,
} from './event.model.dto';

@Injectable()
export class EventService {
    private readonly logger = new Logger(EventService.name, {
        timestamp: true,
    });

    constructor(private prisma: PrismaService) {}

    async createEvent(data: createEventDto) {
        this.logger.debug('Start: create event....', data);
        this.logger.debug('Validate duplicate event name....');

        const checkDup = await this.prisma.event.findFirst({
            where: {
                eventName: { endsWith: data.eventName },
            },
        });
        this.logger.debug('Validate duplicate event name....', checkDup);

        if (checkDup) {
            this.logger.error('Event Name already exists');
            throw new BadRequestException({
                message: {
                    field: 'eventName',
                    message: 'Event Name already exists',
                },
                status: HttpStatus.BAD_REQUEST,
                data: {},
                responseMessage: 'already exists',
            });
        }

        this.logger.debug('Validate duplicate event success!!');
        return this.prisma.event.create({
            data,
        });
    }

    async createEventBatch(data: createEventDtoList) {
        const listEventName = data.events.map((item) => item.eventName);
        const findDuplicate = await this.prisma.event.findMany({
            where: { eventName: { in: listEventName } },
        });

        if (findDuplicate.length > 0) {
            this.logger.warn('Item findDuplicate ==>', findDuplicate);

            await this.prisma.event.createManyAndReturn({
                data: data.events,
                skipDuplicates: true,
            });

            throw new BadRequestException({
                message: findDuplicate.map(() => {
                    return {
                        field: 'eventName',
                        message: 'Event Name already exists',
                    };
                }),
                status: HttpStatus.BAD_REQUEST,
                data: {},
                responseMessage: 'already exists',
            });
        } else {
            this.logger.warn('Item no duplicate ==>');
            return await this.prisma.event.createManyAndReturn({
                data: data.events,
                skipDuplicates: true,
            });
        }
    }

    async eventsList(data: filterEvent<search>) {
        const { orderBy, orderField, filter } = data;
        const startDate = new Date(`${filter?.registrationDate}`).setHours(
            0,
            0,
            0,
            0,
        );

        const eventCount = await this.prisma.event.count();
        const response = await this.prisma.event.findMany({
            where: {
                name: filter?.name ? { contains: filter.name } : {},
                eventName: filter?.eventName
                    ? { contains: filter.eventName }
                    : {},
                companyName: filter?.companyName
                    ? { contains: filter.companyName }
                    : {},
                registrationDate: filter?.registrationDate
                    ? {
                          lte: new Date(startDate),
                          gte: new Date(startDate),
                      }
                    : {},
            },
            orderBy: { [orderField]: orderBy },
        });
        this.logger.warn('List Event Data !!! ===>', response);
        return {
            list: response,
            meta: {
                total: eventCount,
            },
        };
    }
}
