import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventService } from './event.service';
import { createEventDto } from './event.model.dto';

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
    async addEventBatch(@Body() eventData: createEventDto[]) {
        await this.eventService.createEventBatch(eventData);
    }
}
