import {
    BadRequestException,
    HttpStatus,
    Injectable,
    Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Event } from '@prisma/client';
import { createEventDto, createEventDtoList } from './event.model.dto';

@Injectable()
export class EventService {
    private readonly logger = new Logger(EventService.name, {
        timestamp: true,
    });

    constructor(private prisma: PrismaService) {}

    async events(): Promise<Event[]> {
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
                massage: 'Duplicate date',
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
}
