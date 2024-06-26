import { QueryServiceParams } from '../../../../../../src/app/service/types';
import { UuidType } from '../../../../../../src/common/types';
import { RequestDod } from '../../../../../../src/domain/domain-data/domain-types';
import { UserAttrs, UserParams } from '../../../domain-data/user/params';

export type GetUsersRequestDodAttrs = {
  userIds: UuidType[],
}

export type GetUsersRequestDod = RequestDod<'getUsers', GetUsersRequestDodAttrs>

export type GetUsersOut = UserAttrs[]

export type GetUsersServiceParams = QueryServiceParams<
  'GettingUserService',
  UserParams,
  GetUsersRequestDod,
  GetUsersOut,
  never
>
