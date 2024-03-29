import { UuidType } from '../../../../../src/common/types';
import { ErrorDod } from '../../../../../src/domain/domain-data/domain-types';

export type CompanyAlreadyExistError = ErrorDod<'CompanyAlreadyExistError', {
  name: 'CompanyAlreadyExistError',
  text: 'Компания с БИН {{bin}} уже существует',
  hint: { bin: string }
}>

export type CompanyDoesntExistByIdError = ErrorDod<'CompanyDoesntExistByIdError', {
  name: 'CompanyDoesntExistByIdError',
  text: 'Не найдена компания с id: {{id}}',
  hint: { id: UuidType },
}>

export type CompanyDoesntExistByBinError = ErrorDod<'CompanyDoesntExistByBinError', {
  name: 'CompanyDoesntExistByBinError',
  text: 'Не найдена компания с БИН: {{bin}}',
  hint: { bin: string },
}>
