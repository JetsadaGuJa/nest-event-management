import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import {
    createEventDto,
    createEventDtoList,
    filterEvent,
    search,
} from './event.model.dto';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

const mockGetListAll = [
    {
        id: 8,
        name: 'wqwq',
        eventName: 'aaa',
        registrationDate: new Date('2022-03-06T11:00:00.000Z'),
        companyName: 'qwqw',
    },
    {
        id: 7,
        name: 'testaa',
        eventName: 'qqq',
        registrationDate: new Date('2022-03-06T11:00:00.000Z'),
        companyName: 'test',
    },
    {
        id: 188,
        name: 'Jetsada Gujan',
        eventName: 'Event 18',
        registrationDate: new Date('2022-03-06T11:00:00.000Z'),
        companyName: 'PTT Digital',
    },
    {
        id: 191,
        name: 'Jetsada Gujan',
        eventName: 'Event 21',
        registrationDate: new Date('2022-03-06T11:00:00.000Z'),
        companyName: 'PTT Digital',
    },
    {
        id: 190,
        name: 'Jetsada Gujan',
        eventName: 'Event 20',
        registrationDate: new Date('2022-03-06T11:00:00.000Z'),
        companyName: 'PTT Digital',
    },
    {
        id: 189,
        name: 'Jetsada Gujan',
        eventName: 'Event 19',
        registrationDate: new Date('2022-03-06T11:00:00.000Z'),
        companyName: 'PTT Digital',
    },
    {
        id: 1,
        name: 'Jetsada Gujan',
        eventName: 'Event 999999',
        registrationDate: new Date('2022-03-06T11:00:00.000Z'),
        companyName: 'PTT Digital',
    },
    {
        id: 192,
        name: 'Jetsada Gujan',
        eventName: 'Event 22',
        registrationDate: new Date('2022-03-06T11:00:00.000Z'),
        companyName: 'PTT Digital',
    },
    {
        id: 193,
        name: 'Jetsada Gujan',
        eventName: 'Event 24',
        registrationDate: new Date('2022-03-06T11:00:00.000Z'),
        companyName: 'PTT Digital',
    },
    {
        id: 5,
        name: 'Jetsada Gujan',
        eventName: 'Event 999992',
        registrationDate: new Date('2022-03-06T11:00:00.000Z'),
        companyName: 'PTT Digital',
    },
    {
        id: 6,
        name: 'test',
        eventName: 'test',
        registrationDate: new Date('2022-03-06T11:00:00.000Z'),
        companyName: 'eee',
    },
    {
        id: 103,
        name: 'Jetsada Gujan',
        eventName: 'Event 1cczx',
        registrationDate: new Date('2022-03-06T11:00:00.000Z'),
        companyName: 'PTT Digital',
    },
    {
        id: 104,
        name: 'Jetsada Gujan',
        eventName: 'Event 777999scaasczzzz',
        registrationDate: new Date('2022-03-06T11:00:00.000Z'),
        companyName: 'PTT Digital',
    },
    {
        id: 102,
        name: 'Jetsada Gujan',
        eventName: 'Event 1asasdasd',
        registrationDate: new Date('2022-03-06T11:00:00.000Z'),
        companyName: 'PTT Digital',
    },
    {
        id: 24,
        name: 'Jetsada Gujan',
        eventName: 'Event 4',
        registrationDate: new Date('2022-03-06T11:00:00.000Z'),
        companyName: 'PTT Digital',
    },
];

describe('EventService', () => {
    let eventService: EventService;
    let prismaMock: DeepMockProxy<PrismaClient>;

    beforeEach(async () => {
        prismaMock = mockDeep<PrismaClient>();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventService,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
            ],
        }).compile();

        eventService = module.get<EventService>(EventService);
    });

    describe('Get Event List', () => {
        it('Get All Event', async () => {
            const search = new filterEvent<search>();
            search.page = 1;
            search.perPage = 15;
            const result = await eventService.eventsList(search);
            const listAll = mockGetListAll;
            prismaMock.event.findMany.mockResolvedValueOnce(listAll);
            expect({
                status: 201,
                message: 'success',
                ...result,
            }).toEqual({
                status: 201,
                message: 'success',
                ...result,
            });
        });

        it('Get All Event With filter', async () => {
            const search = new filterEvent<search>();
            search.page = 1;
            search.perPage = 15;
            search.filter = {
                name: 'Jetsada Gujan',
                eventName: 'Event 24',
                registrationDate: '2024-11-05T17:00:00.000Z',
                companyName: 'PTT Digital',
            };
            const result = await eventService.eventsList(search);
            const listAll = mockGetListAll;
            prismaMock.event.findMany.mockResolvedValueOnce(listAll);
            expect({
                status: 201,
                message: 'success',
                ...result,
            }).toEqual({
                status: 201,
                message: 'success',
                ...result,
            });
        });
    });

    describe('Create Event', () => {
        it('Create Event Success', async () => {
            let reqBody = new createEventDto();
            reqBody = {
                name: 'Jetsada Gujan',
                companyName: 'PTT Digital',
                registrationDate: '2024-11-05T17:00:00.000Z',
                eventName: 'Event test',
            };
            prismaMock.event.findFirst.mockResolvedValueOnce(null);
            const result = await eventService.createEvent(reqBody);
            prismaMock.event.create.mockRejectedValueOnce(reqBody);
            expect({
                status: 201,
                message: 'success',
                ...result,
            }).toEqual({
                status: 201,
                message: 'success',
                ...result,
            });
        });

        it('Create Event Have Data Dup', async () => {
            let reqBody = new createEventDto();
            reqBody = {
                name: 'Jetsada Gujan',
                companyName: 'PTT Digital',
                registrationDate: '2024-11-05T17:00:00.000Z',
                eventName: 'Event test',
            };
            prismaMock.event.findFirst.mockResolvedValueOnce({
                name: 'Jetsada Gujan',
                companyName: 'PTT Digital',
                registrationDate: new Date('2024-11-05T17:00:00.000Z'),
                eventName: 'Event test',
                id: 1,
            });

            await expect(eventService.createEvent(reqBody)).rejects.toThrow(
                new BadRequestException({
                    message: {
                        field: 'eventName',
                        message: 'Event Name already exists',
                    },
                    status: HttpStatus.BAD_REQUEST,
                    data: {},
                    responseMessage: 'already exists',
                }),
            );
        });
    });

    describe('Create Event Batch', () => {
        it('Create Event Batch Success', async () => {
            let reqBody = new createEventDtoList();
            reqBody = {
                events: [
                    {
                        name: 'Jetsada Gujan',
                        companyName: 'PTT Digital',
                        registrationDate: '2024-11-05T17:00:00.000Z',
                        eventName: 'Event test',
                    },
                ],
            };
            const ofImportDto = plainToInstance(createEventDtoList, reqBody);
            const errors = await validate(ofImportDto);
            expect(errors.length).toBe(0);
            prismaMock.event.findMany.mockResolvedValueOnce([]);
            const result = await eventService.createEventBatch(reqBody);
            prismaMock.event.create.mockRejectedValueOnce(reqBody);
            expect({
                status: 201,
                message: 'success',
                ...result,
            }).toEqual({
                status: 201,
                message: 'success',
                ...result,
            });
        });

        it('Create Event Batch Fail', async () => {
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
            const ofImportDto = plainToInstance(createEventDtoList, reqBody);
            const errors = await validate(ofImportDto);
            expect(errors.length).not.toBe(0);
        });

        it('Create Event Batch Duplicate', async () => {
            let reqBody = new createEventDtoList();
            reqBody = {
                events: [
                    {
                        name: 'Jetsada Gujan',
                        companyName: 'PTT Digital',
                        registrationDate: '2024-11-05T17:00:00.000Z',
                        eventName: 'Event test',
                    },
                ],
            };
            prismaMock.event.findMany.mockResolvedValueOnce([
                {
                    id: 1,
                    name: 'Jetsada Gujan',
                    companyName: 'PTT Digital',
                    registrationDate: new Date('2024-11-05T17:00:00.000Z'),
                    eventName: 'Event test',
                },
            ]);

            await expect(
                eventService.createEventBatch(reqBody),
            ).rejects.toThrow();
        });
    });
});
