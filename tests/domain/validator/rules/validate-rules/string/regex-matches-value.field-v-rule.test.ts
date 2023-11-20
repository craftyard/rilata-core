import { describe, expect, test } from 'bun:test';
import { RegexMatchesValueValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/regex-matches-value.field-v-rule';

describe('Validating strings using regular expressions', () => {
  test('Text must end with world', () => {
    const sut = new RegexMatchesValueValidationRule(/world$/, 'Текст должен заканчиваться на слово world');
    const result = sut.validate('Hello world');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });
  test('success ИИН is valid', () => {
    const sut = new RegexMatchesValueValidationRule(/^[0-9]\d{11}$/, 'Введите ИИН (12 цифр) ');
    const result = sut.validate('010625530759');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });
  test('failure ИИН is not valid', () => {
    const sut = new RegexMatchesValueValidationRule(/^[0-9]\d{11}$/, 'Введите ИИН (12 цифр) ');
    const result = sut.validate('0106255307');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Введите ИИН (12 цифр) ',
      },
    });
  });
  test('success, correct phone number entered', () => {
    const sut = new RegexMatchesValueValidationRule(/^\+\d{1,3} \d{3} \d{3} \d{4}$/, 'Введите номер в формате +7 702 777 7777');
    const result = sut.validate('+7 702 950 7304');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });
  test('failure, incorrect phone number entered', () => {
    const sut = new RegexMatchesValueValidationRule(/^\+\d{1,3} \d{3} \d{3} \d{2}$/, 'Введите номер в формате +7 702 777 7777');
    const result = sut.validate('+7 709507 73224');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Введите номер в формате +7 702 777 7777',
      },
    });
  });
});
