import { QueryService } from '../../../../../../src/app/service/concrete-service/query.service';
import { ServiceResult } from '../../../../../../src/app/service/types';
import { success } from '../../../../../../src/common/result/success';
import { dtoUtility } from '../../../../../../src/common/utils/dto/dto-utility';
import { UserAttrs } from '../../../domain-data/user/params';
import { UserRepository } from '../../../domain-object/user/repo';
import { AuthModuleResolver } from '../../../resolver';
import { GetUsersRequestDod, GetUsersServiceParams } from './s-params';
import { getUsersValidator } from './v-map';

export class GetingUsersService extends QueryService<
  GetUsersServiceParams, AuthModuleResolver
> {
  inputDodName = 'getUsers' as const;

  moduleName = 'AuthModule' as const;

  serviceName = 'GettingUserService' as const;

  aRootName = 'UserAR' as const;

  protected supportedCallers = ['DomainUser', 'ModuleCaller'] as const;

  protected validator = getUsersValidator;

  async runDomain(
    input: GetUsersRequestDod,
  ): Promise<ServiceResult<GetUsersServiceParams>> {
    const userRepo = UserRepository.instance(this.moduleResolver);
    const userResults = await Promise.all(input.attrs.userIds
      .map((id) => userRepo.getUser(id)));
    return success(
      userResults
        .filter((result) => result.isSuccess())
        .map((result) => dtoUtility.excludeAttrs(
          result.value as (UserAttrs & { version: number }), 'version',
        ) as UserAttrs),
    );
  }
}
