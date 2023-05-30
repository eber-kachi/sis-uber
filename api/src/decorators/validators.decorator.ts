/* tslint:disable:naming-convention */

import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserRepository } from '../modules/user/user.repository';

export function IsPassword(validationOptions?: ValidationOptions): PropertyDecorator {
  return (object: any, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'isPassword',
      target: object.constructor,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string, _args: ValidationArguments) {
          return /^[a-zA-Z0-9!@#$%^&*]*$/.test(value);
        },
      },
    });
  };
}

//validator if user exist
@ValidatorConstraint({ async: true })
export class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {
  validate(userName: any, args: ValidationArguments) {
    // return UserRepository. .findOneByName(userName).then(user => {
    //   if (user) return false;
    //   return true;
    // });
    return true;
  }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserAlreadyExistConstraint,
    });
  };
}
