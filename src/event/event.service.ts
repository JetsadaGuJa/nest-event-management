import {
    BadRequestException,
    HttpStatus,
    Injectable,
    Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { createEventDto, createEventDtoList } from './event.model.dto';

@Injectable()
export class EventService {
    private readonly logger = new Logger(EventService.name, {
        timestamp: true,
    });

    constructor(private prisma: PrismaService) {}

    async events() {
        this.logger.log('Start: event list....');
        return this.prisma.event.findMany();
    }

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
                massage: 'Event Name already exists',
                status: HttpStatus.BAD_REQUEST,
                data: [checkDup],
                responseMassage: '',
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
                massage: 'Duplicate data',
                status: HttpStatus.BAD_REQUEST,
                data: findDuplicate,
                responseMassage: '',
            });
        } else {
            this.logger.warn('Item no duplicate ==>');
            return await this.prisma.event.createManyAndReturn({
                data: data.events,
                skipDuplicates: true,
            });
        }
    }
    async eventsList(data: {
        orderField?: string;
        orderBy?: 'asc' | 'desc';
        filter?: {
            firstName?: string;
            lastName?: string;
            eventName?: string;
            companyName?: string;
            registrationDate?: string;
        };
        page?: number;
        perPage?: number;
    }) {
        const {
            orderBy = 'asc',
            orderField = 'registrationDate',
            page = 1,
            perPage = 10,
            filter = {},
        } = data;
        const sort: Prisma.EventOrderByWithRelationInput = {
            [orderField]: orderBy,
        };
        const queryWhere: Prisma.EventWhereInput = {};

        if (filter?.eventName) {
            queryWhere.eventName = { contains: filter.eventName };
        }

        // queryWhere.firstName;

        this.logger.log('Start: event list....');
        const query: Prisma.EventFindManyArgs = {
            skip: perPage * page,
            take: perPage,
            where: { ...queryWhere },
            // {
            //     firstName: filter?.firstName
            //         ? { contains: filter?.firstName }
            //         : {},
            //     lastName: filter?.lastName
            //         ? { contains: filter?.lastName }
            //         : {},
            //     eventName: filter?.eventName
            //         ? { contains: filter?.eventName }
            //         : {},
            //     companyName: filter?.companyName
            //         ? { contains: filter?.companyName }
            //         : {},
            //     registrationDate: filter?.registrationDate
            //         ? {
            //               gte: new Date(filter?.registrationDate)
            //                   .setHours(0)
            //                   .toString(),
            //               lte: new Date(filter?.registrationDate)
            //                   .setHours(23)
            //                   .toString(),
            //           }
            //         : {},
            // },
            orderBy: sort,
        };
        const eventCount = await this.prisma.event.count();
        return await this.prisma.event
            .findMany(
                { ...query },
                // { where: { eventName: { contains: 'Event 4' } } },
            )
            .then((response) => {
                return {
                    ...response,
                    meta: {
                        total: eventCount,
                        page,
                        perPage,
                    },
                };
            });
    }
}
