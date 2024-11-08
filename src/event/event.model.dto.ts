import {
    IsArray,
    IsDateString,
    IsNotEmpty,
    IsOptional,
    IsString,
    Validate,
    ValidateNested,
} from 'class-validator';
import { CustomValidateDate } from './customValidateDateISO';
import { Type } from 'class-transformer';

export class createEventDto {
    @IsNotEmpty()
    name: string;

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

export class filterEvent<T> {
    @IsOptional()
    @IsString()
    orderField = 'id';

    @IsOptional()
    @IsString()
    orderBy: 'asc' | 'desc' = 'desc';

    @IsOptional()
    filter?: T;

    @IsOptional()
    page?: number = 1;

    @IsOptional()
    perPage?: number = 10;
}

export class search {
    @IsOptional()
    name?: string;

    @IsOptional()
    eventName?: string;

    @IsOptional()
    companyName?: string;

    @IsOptional()
    @IsDateString()
    @Validate(CustomValidateDate)
    registrationDate?: string;
}
