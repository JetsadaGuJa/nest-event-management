import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventService } from './event.service';
import { createEventDto, createEventDtoList } from './event.model.dto';

@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) {}

    @Get()
    getAllEvents() {
        return this.eventService.events();
    }

    @Post()
    async addEvent(@Body() eventData: createEventDto) {
        await this.eventService.createEvent(eventData);
    }

    @Post('event-batch')
    async addEventBatch(@Body() eventData: createEventDtoList) {
        await this.eventService.createEventBatch(eventData);
    }

    @Post('list')
    async getList(
        @Body()
        data: {
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
        },
    ) {
        return this.eventService.eventsList(data);
    }
}
