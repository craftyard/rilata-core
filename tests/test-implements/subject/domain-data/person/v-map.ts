import { DtoFieldValidator } from '../../../../../src/domain/validator/field-validator/dto-field-validator';
import { LiteralFieldValidator } from '../../../../../src/domain/validator/field-validator/literal-field-validator';
import { CannotEmptyStringField } from '../../../../../src/domain/validator/field-validator/prepared-fields/string/cannot-empty-string';
import { StringChoiceFieldValidator } from '../../../../../src/domain/validator/field-validator/prepared-fields/string/choice';
import { UuidField } from '../../../../../src/domain/validator/field-validator/prepared-fields/string/uuid-field';
import { ValidatorMap } from '../../../../../src/domain/validator/field-validator/types';
import { EmailFormatValidationRule } from '../../../../../src/domain/validator/rules/validate-rules/string/email-format.field-v-rule';
import { RegexMatchesValueValidationRule } from '../../../../../src/domain/validator/rules/validate-rules/string/regex-matches-value.field-v-rule';
import { PhoneNumberFieldValidator } from './field-validators';
import {
  ContactsAttrs, EmailAttrs, PersonAttrs, PhoneAttrs,
} from './params';

const phoneVMap: ValidatorMap<PhoneAttrs> = {
  number: new PhoneNumberFieldValidator<'number', true, false>('number', true, { isArray: false }, []),
  type: new StringChoiceFieldValidator<'type', true, false>('type', true, { isArray: false }, ['mobile', 'work', 'home']),
};

const emailVMap: ValidatorMap<EmailAttrs> = {
  email: new LiteralFieldValidator('email', true, { isArray: false }, 'string', [new EmailFormatValidationRule()]),
  type: new StringChoiceFieldValidator<'type', true, false>('type', true, { isArray: false }, ['corporate', 'private']),
};

const contactsVMap: ValidatorMap<ContactsAttrs> = {
  phones: new DtoFieldValidator('phones', true, { isArray: true, mustBeFilled: true }, 'dto', phoneVMap),
  email: new DtoFieldValidator('email', false, { isArray: true }, 'dto', emailVMap),
  address: new CannotEmptyStringField('address', false, []),
};

export const personAttrsVMap: ValidatorMap<PersonAttrs> = {
  id: new UuidField('id'),
  govPersonId: new CannotEmptyStringField('govPersonId', true, [new RegexMatchesValueValidationRule(/^[0-9]{12}$/, 'ИИН должен содержать только 12 цифровых символов.')]),
  name: new CannotEmptyStringField('name', true, []),
  lastName: new CannotEmptyStringField('lastName', true, []),
  patronomic: new CannotEmptyStringField('patronomic', false, []),
  contacts: new DtoFieldValidator('contacts', true, { isArray: false }, 'dto', contactsVMap),
};
