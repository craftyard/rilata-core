import { DTO } from '../../domain/dto';
import { TestRepository } from './test.repository';
import { Asyncable, TestBatchRecords } from './types';

export interface TestDatabase<ASYNC extends boolean> {
  addBatch<R extends TestRepository<string, DTO, ASYNC>>(
    batchRecords: TestBatchRecords<R>
  ): Asyncable<ASYNC, void>

  clear(): Asyncable<ASYNC, void | void[]>
}
