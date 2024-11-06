import { Logger } from '@nestjs/common';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'customValidateDate', async: false })
export class CustomValidateDate implements ValidatorConstraintInterface {
    private readonly logger = new Logger(CustomValidateDate.name, {
        timestamp: true,
    });
    validate(text: string, args: ValidationArguments) {
        this.logger.warn('on validate custom text===>', text);
        this.logger.warn('on validate custom args===>', args);
        // return new Date(args.value) === 'Invalid Date';
        const date = new Date(args.value);
        if (Object.prototype.toString.call(date) === '[object Date]') {
            if (isNaN(date.getTime())) {
                return false;
            }
        }
        return true;
    }

    defaultMessage(args: ValidationArguments) {
        // here you can provide default error message if validation failed
        this.logger.warn('on validate custom defaultMessage===>', args);
        return '($value) is not Date ISO!';
    }
}
