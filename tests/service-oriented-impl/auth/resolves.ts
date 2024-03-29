import { ModuleResolves } from '../../../src/app/module/module-resolves';
import { UserRepository } from './domain-object/user/repo';
import { AuthModule } from './module';

export type AuthResolves = ModuleResolves<AuthModule> & {
  moduleUrl: '/api/auth-module/',
  userRepo: UserRepository,
}
