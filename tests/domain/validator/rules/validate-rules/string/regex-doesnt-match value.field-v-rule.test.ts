import { describe, expect, test } from 'bun:test';
import { RegexDoesntMatchValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/regex-doesnt-match value.field-v-rule';

describe('Validating strings using regular expressions', () => {
  test('succes, ИИН is valid', () => {
    const sut = new RegexDoesntMatchValidationRule(/^[0-9]\d{11}$/, 'Введите ИИН (12 цифр) ');
    const result = sut.validate('0106255307');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });
  test('succes, The correct phone number has been entered', () => {
    const sut = new RegexDoesntMatchValidationRule(/^\+\d{1,3} \d{3} \d{3} \d{2}$/, 'Введите номер в формате +7 702 777 7777');
    const result = sut.validate('+7 709507 73224');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });
  test('The text should not end with the word world', () => {
    const sut = new RegexDoesntMatchValidationRule(/world$/, 'Текст не должен заканчиваться на слово world');
    const result = sut.validate('Hello world');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Текст не должен заканчиваться на слово world',
      },
    });
  });
  test('failure, IIN is invalid', () => {
    const sut = new RegexDoesntMatchValidationRule(/^[0-9]\d{11}$/, 'Введите ИИН (12 цифр) ');
    const result = sut.validate('010625530759');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Введите ИИН (12 цифр) ',
      },
    });
  });
  test('failure, incorrect phone number entered', () => {
    const sut = new RegexDoesntMatchValidationRule(/^\+\d{1,3} \d{3} \d{3} \d{4}$/, 'Введите номер в формате +7 702 777 7777');
    const result = sut.validate('+7 702 950 7304');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Введите номер в формате +7 702 777 7777',
      },
    });
  });
});
