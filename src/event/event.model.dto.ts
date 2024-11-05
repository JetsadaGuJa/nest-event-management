import {
    IsArray,
    IsDateString,
    IsNotEmpty,
    Validate,
    ValidateNested,
} from 'class-validator';
import { CustomValidateDate } from './customValidateDateISO';
import { Type } from 'class-transformer';

export class createEventDto {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    eventName: string;

    @IsNotEmpty()
    companyName: string;

    @IsNotEmpty()
    @IsDateString()
    @Validate(CustomValidateDate)
    registrationDate: string;
}

export class createEventDtoList {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => createEventDto)
    events: createEventDto[];
}
