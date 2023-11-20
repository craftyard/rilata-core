import { RegexMatchesValueValidationRule } from './regex-matches-value.field-v-rule';

export class NoContanedSpaсeValidationRule extends RegexMatchesValueValidationRule {
  constructor() {
    super(/^\S*$/, 'Не должно быть пробелов');
  }
}
