import { Body, Controller, Post } from '@nestjs/common';
import { EventService } from './event.service';
import {
    createEventDto,
    createEventDtoList,
    filterEvent,
    search,
} from './event.model.dto';

@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) {}

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
        data: filterEvent<search>,
    ) {
        return this.eventService.eventsList(data);
    }
}
