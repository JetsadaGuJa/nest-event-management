import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Event } from '@prisma/client';
import { createEventDto } from './event.model.dto';

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

    async createEvent(data: createEventDto): Promise<Event> {
        this.logger.log('Start: create event....');
        this.logger.log('Validate duplicate event name....');
        const checkDup = await this.prisma.event.findFirst({
            where: {
                eventName: { endsWith: data.eventName },
            },
        });
        if (checkDup) {
            this.logger.error('Event Name already exists');
            throw new BadRequestException('Event Name already exists');
        }
        this.logger.log('Validate duplicate event success!!');
        return this.prisma.event.create({
            data,
        });
    }

    async createEventBatch(data: createEventDto[]) {
        const eventBatch = await this.prisma.event.createManyAndReturn({
            data: [...data],
            skipDuplicates: true,
        });
        if (eventBatch.length > 0) {
            this.logger.log('dup list ==>', eventBatch);
            return eventBatch;
        }
        this.logger.log('dup list ==>', eventBatch);

        return eventBatch;
    }
}
