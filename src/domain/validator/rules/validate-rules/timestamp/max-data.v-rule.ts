import { ValidationRuleAnswer } from '../../types';
import { ValidationRule } from '../../validation-rule';

export class MaxDateStampValidationRule extends ValidationRule<'validate', number> {
  requirement = 'Дата должно быть раньше {{maxDate}}';

  private maxDateAsTimestamp: number;

  constructor(maxDate: Date) {
    super();
    this.maxDateAsTimestamp = maxDate.getTime();
  }

  validate(value: number): ValidationRuleAnswer {
    return value < this.maxDateAsTimestamp
      ? this.returnSuccess('RunNextRule')
      : this.returnFail('SaveErrorAndRunNextRule', { maxDate: this.maxDateAsTimestamp });
  }
}
