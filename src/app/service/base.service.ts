/* eslint-disable @typescript-eslint/no-unused-vars */
import { failure } from '../../common/result/failure';
import { success } from '../../common/result/success';
import { Result } from '../../common/result/types';
import {
  ServiceResult, InputDodValidator,
  GeneralBaseServiceParams, GetModuleName,
} from './types';
import { Service } from './service';
import { ValidationError } from './error-types';
import { storeDispatcher } from '../async-store/store-dispatcher';
import { GeneralModuleResolver } from '../module/types';
import { permissionDeniedError } from './constants';
import { CallerType } from '../controller/types';
import { dodUtility } from '../../common/utils/dod/dod-utility';

export abstract class BaseService<
  P extends GeneralBaseServiceParams, RES extends GeneralModuleResolver
> extends Service<RES> {
  abstract override moduleName: GetModuleName<RES>;

  abstract override serviceName: P['serviceName'];

  abstract override inputDodName: P['input']['meta']['name'];

  abstract override aRootName: P['aRootName'];

  protected abstract supportedCallers: ReadonlyArray<CallerType>;

  protected abstract validator: InputDodValidator<P['input']>;

  /** Выполнить сервис */
  async execute(input: P['input']): Promise<ServiceResult<P>> {
    const checksResult = this.runInitialChecks(input);
    if (checksResult.isFailure()) return checksResult;
    return this.executeService(input);
  }

  /** Выполнить внутреннюю работу сервиса (БД, транзакции, доменого слоя) */
  protected abstract executeService(input: P['input']): Promise<ServiceResult<P>>

  /** Выполнить работу доменной логики */
  abstract runDomain(input: P['input']): Promise<ServiceResult<P>> | ServiceResult<P>

  /** Выполнить проверку разрешений пользователя и валидации */
  protected runInitialChecks(
    input: P['input'],
  ): Result<ValidationError | typeof permissionDeniedError, undefined> {
    const checkCallerResult = this.checkCallerPermission();
    if (checkCallerResult.isFailure()) return checkCallerResult;
    return this.checkValidations(input);
  }

  // eslint-disable-next-line max-len
  protected checkCallerPermission(): Result<typeof permissionDeniedError, undefined> {
    const { caller } = storeDispatcher.getStoreOrExepction();
    if (this.supportedCallers.includes(caller.type)) return success(undefined);
    return failure(permissionDeniedError);
  }

  protected checkValidations(
    input: P['input'],
  ): Result<ValidationError, undefined> {
    if ((input as any).attrs === undefined) {
      throw this.logger.error('validate implemented only requestDod and eventDod');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = this.validator.validate((input as any).attrs);

    if (result.isFailure()) {
      return failure(dodUtility.getValidationError(result.value));
    }
    return result;
  }
}
