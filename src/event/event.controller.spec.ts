import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import {
    createEventDto,
    createEventDtoList,
    filterEvent,
    search,
} from './event.model.dto';

describe('EventController', () => {
    let controller: EventController;
    let prismaMock: DeepMockProxy<PrismaClient>;

    beforeEach(async () => {
        prismaMock = mockDeep<PrismaClient>();
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EventController],
            providers: [
                EventService,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
            ],
        }).compile();

        controller = module.get<EventController>(EventController);
    });

    it('should be getList', async () => {
        const search = new filterEvent<search>();
        search.page = 1;
        search.perPage = 15;
        search.filter = {
            name: 'Jetsada Gujan',
            eventName: 'Event 24',
            registrationDate: '2024-11-05T17:00:00.000Z',
            companyName: 'PTT Digital',
        };
        expect(controller.getList(search)).resolves.nthReturnedWith;
    });

    it('should be addEvent', async () => {
        let reqBody = new createEventDto();
        reqBody = {
            name: 'Jetsada Gujan',
            companyName: 'PTT Digital',
            registrationDate: '2024-11-05T17:00:00.000Z',
            eventName: 'Event test',
        };
        expect(controller.addEvent(reqBody)).resolves.nthReturnedWith;
    });

    it('should be getList', async () => {
        let reqBody = new createEventDtoList();
        reqBody = {
            events: [
                {
                    name: 'Jetsada Gujan',
                    companyName: 'PTT Digital',
                    registrationDate: '',
                    eventName: 'Event test',
                },
            ],
        };
        prismaMock.event.findMany.mockResolvedValueOnce([]);
        expect(controller.addEventBatch(reqBody)).resolves.nthReturnedWith;
    });
});
