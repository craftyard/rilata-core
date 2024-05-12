import { UuidType } from '../../common/types';
import { GeneralEventDod } from '../../domain/domain-data/domain-types';
import { GeneralARDParams } from '../../domain/domain-data/params-types';
import { GetARParamsEvents } from '../../domain/domain-data/type-functions';
import { GeneralModuleResolver } from '../module/types';
import { Repositoriable } from '../resolves/repositoriable';
import { Asyncable } from '../types';

export interface EventRepository<ASYNC extends boolean> {
  init(resovler: GeneralModuleResolver): void

  addEvents(event: GeneralEventDod[]): Asyncable<ASYNC, unknown>

  findEvent(id: UuidType): Asyncable<ASYNC, GeneralEventDod | undefined>

  isExist(id: UuidType): Asyncable<ASYNC, boolean>

  // eslint-disable-next-line max-len
  getAggregateEvents<A extends GeneralARDParams>(aRootId: UuidType): Asyncable<ASYNC, GetARParamsEvents<A>[]>
}

export const EventRepository = {
  instance<ASYNC extends boolean>(resolver: Repositoriable): EventRepository<ASYNC> {
    return resolver.resolveRepo(EventRepository) as EventRepository<ASYNC>;
  },
};
