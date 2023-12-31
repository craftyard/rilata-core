import { Databaseable } from './databaseable';
import { Repositoriable } from './repositoriable';
import { Loggable } from './loggable';
import { Moduleable } from './moduleable';
import { Module } from '../module/module';
import { Realisable } from './realisable';
import { RunMode } from '../types';

export interface ModuleResolver
  extends Moduleable, Loggable, Repositoriable, Databaseable, Realisable {
  init(module: Module): void

  getRunMode(): RunMode
}
