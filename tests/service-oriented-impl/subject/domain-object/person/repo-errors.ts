import { UuidType } from '../../../../../src/common/types';
import { ErrorDod } from '../../../../../src/domain/domain-data/domain-types';

export type PersonAlreadyExistsError = ErrorDod<'PersonAlreadyExistsError', {
  text: 'Человек с данным ИИН уже существует в системе',
  hint: Record<'iin', string>,
  name: 'PersonAlreadyExistsError',
}>;

export type PersonDoesntExistByIdError = ErrorDod<'PersonDoesntExistByIdError', {
  name: 'PersonDoesntExistByIdError',
  text: 'Не найден человек с id: {{id}}',
  hint: { id: UuidType },
}>

export type PersonDoesntExistByIinError = ErrorDod<'PersonDoesntExistByIinError', {
  name: 'PersonDoesntExistByIinError',
  text: 'Не найден человек с ИИН: {{iin}}',
  hint: { iin: string },
}>
