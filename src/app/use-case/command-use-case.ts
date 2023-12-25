/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import { GeneralCommandUcParams, GetUcOptions, UcResult } from './types';
import { QueryUseCase } from './query-use-case';
import { UnitOfWork } from '../unit-of-work/unit-of-work';
import { DatabaseObjectSavingError, OptimisticLockVersionMismatchError } from '../../common/exeptions';

export abstract class CommandUseCase<
  UC_PARAMS extends GeneralCommandUcParams,
> extends QueryUseCase<UC_PARAMS> {
  override async execute(options: GetUcOptions<UC_PARAMS>): Promise<UcResult<UC_PARAMS>> {
    // разрешить юзкейсу перезапуститься 1 раз, если возникла ошибка в БД.
    let databaseErrorRestartAttempts = 1;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        return await this.executeUseOfUnitOfWork(options);
      } catch (e) {
        if (e instanceof OptimisticLockVersionMismatchError) {
          continue;
        } else if (e instanceof DatabaseObjectSavingError) {
          if (databaseErrorRestartAttempts === 0) throw e;
          databaseErrorRestartAttempts -= 1;
          continue;
        } else {
          throw e;
        }
      }
    }
  }

  protected async executeUseOfUnitOfWork(
    options: GetUcOptions<UC_PARAMS>,
  ): Promise<UcResult<UC_PARAMS>> {
    const unitOfWork = new UnitOfWork(this.moduleResolver);
    try {
      const res = await super.execute(options);
      if (res.isSuccess()) await unitOfWork.commit();
      else await unitOfWork.rollback();
      return res;
    } catch (e) {
      await unitOfWork.rollback();
      throw e;
    }
  }
}
