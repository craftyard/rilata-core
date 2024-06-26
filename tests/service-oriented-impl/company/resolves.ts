import { EventRepository } from '../../../src/app/database/event.repository';
import { ModuleResolves } from '../../../src/app/module/m-resolves';
import { AuthFacade } from '../auth/facade';
import { CompanyRepository } from '../company/domain-object/company/repo';
import { SubjectFacade } from '../subject/facade';
import { CompanyModule } from './module';

export type CompanyResolves = ModuleResolves<CompanyModule> & {
  moduleUrls: ['/api/company-module/'],
  companyRepo: CompanyRepository,
  subjectFacade: SubjectFacade,
  authFacade: AuthFacade,
  eventRepo: EventRepository<true>,
}
