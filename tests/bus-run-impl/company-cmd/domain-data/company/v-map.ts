import { DtoFieldValidator } from '../../../../../src/domain/validator/field-validator/dto-field-validator';
import { LiteralFieldValidator } from '../../../../../src/domain/validator/field-validator/literal-field-validator';
import { UuidField } from '../../../../../src/domain/validator/field-validator/prepared-fields/string/uuid-field';
import { ValidatorMap } from '../../../../../src/domain/validator/field-validator/types';
import { MaxCharsCountValidationRule } from '../../../../../src/domain/validator/rules/validate-rules/string/max-chars-count.v-rule';
import { RegexMatchesValueValidationRule } from '../../../../../src/domain/validator/rules/validate-rules/string/regex-matches-value.field-v-rule';
import { CompanyAttrs } from './params';

export const companyAttrsVMap: ValidatorMap<CompanyAttrs> = {
  id: new UuidField('id'),
  name: new LiteralFieldValidator('name', true, { isArray: false }, 'string', [
    new MaxCharsCountValidationRule(50),
  ]),
  bin: new LiteralFieldValidator('bin', true, { isArray: false }, 'string', [
    new RegexMatchesValueValidationRule(/^[0-9]{12}$/, 'Может быть только 12 цифр'),
  ]),
  address: new LiteralFieldValidator('address', false, { isArray: false }, 'string', [
    new MaxCharsCountValidationRule(250),
  ]),
};
export const companyInvariantsValidator = new DtoFieldValidator(
  'comanyInvariants', true, { isArray: false }, 'dto', companyAttrsVMap,
);
