import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventController } from './event/event.controller';
import { EventService } from './event/event.service';
import { EventModule } from './event/event.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
    imports: [EventModule],
    controllers: [AppController, EventController],
    providers: [AppService, EventService, PrismaService],
})
export class AppModule {}
