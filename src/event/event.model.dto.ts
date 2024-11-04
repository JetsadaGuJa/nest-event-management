import { IsDateString, IsNotEmpty } from 'class-validator';

export class createEventDto {
    @IsNotEmpty()
    firstName: string;
    lastName: string;
    eventName: string;
    companyName: string;

    @IsDateString()
    registrationDate: string;
}
