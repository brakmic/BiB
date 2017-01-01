import { EmailValidator } from './email.validator';
import { EqualPasswordsValidator } from './equalPasswords.validator';


export const ADV_VALIDATORS = [
    EmailValidator,
    EqualPasswordsValidator
];
