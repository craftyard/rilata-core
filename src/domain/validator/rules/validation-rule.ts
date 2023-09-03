import { Logger } from '../../../common/logger/logger';
import {
  RuleType, RuleDataType, GetRuleAnswer, RuleError, GetFailBehaviourString,
  GetSuccessBehaviourString, RuleHint, GetFailRuleAnswer, GetSuccessRuleAnswer,
} from './types';

/** Класс для правил валидации.
  Рекомендуется, чтобы один класс проверял только одну проверку.
  Валидатор будет по очереди пропускать через каждое правило,
  в случае неуспеха проверки могут быть два поведения:
    1. Процесс проверки прерывается и возвращается текущая ошибка.
    2. Ошибка кэшируется, а процесс проверки продолжается через следующие правила.
  Правила валидации делятся на следующие категории:
    1. Проверки типов. В случае неуспеха проверки, процесс проверки прерывается.
    2. Проверки утверждении. В случае неуспеха проверки, процесс проверки прерывается.
    3. Проверки на пустые значения. Если допустимо пустое значение, например
      undefined, то как правило проверки следующих правил не имеет смысла.
      Проверки данной категории могут прервать процесс проверки, но валидация
      будет считаться успешной.
    4. Проверки валидации. В случае не успеха, может прервать процесс проверки,
      но обычное поведение вернуть ошибки и позволить продолжить проверку для
      сбора всех возможных ошибок для данного значения.
  */
export abstract class ValidationRule<RT extends RuleType, VT extends RuleDataType> {
  /** Написать требование для пользователя необходмое для прохождения валидации.
    Если в требование хотите вставить определенное значение,
    то вам необходимо передать ее в hints, а в требовании вставить ее {{hintName}}
    Пример: {
      requirement: 'Значение должно быть больше {{min}} и меньше {{max}}',
      ruleHint: { min: 5, max: 10 },
    } */
  abstract requirement: string;

  protected logger!: Logger;

  init(logger: Logger): void {
    this.logger = logger;
  }

  /** Возвращает соответствует ли значение правилам валидации */
  abstract validate(value: VT): GetRuleAnswer<RT>;

  /** возвращает текстовое сообщение для пользователя по переданной ошибке.
    Сделана такая сложность, для поддержки перевода на другие языки. */
  static rawToMessage(ruleErr: RuleError): string {
    const tuples = [['_', ruleErr.requirement]].concat(
      Object.entries(ruleErr.ruleHint).map(([key, value]) => [key, String(value)]),
    );

    return tuples.reduce(
      ([_, raw], [key, value]) => ['_', this.replaceByRegex(raw, key, String(value))],
    )[1];
  }

  /** Возвращает успешный ответ */
  protected returnSuccess(behaviour: GetSuccessBehaviourString<RT>): GetSuccessRuleAnswer<RT> {
    return { behaviour } as GetSuccessRuleAnswer<RT>;
  }

  /** Возвращает неуспешный ответ */
  protected returnFail(
    behaviour: GetFailBehaviourString<RT>,
    hint: RuleHint = {},
  ): GetFailRuleAnswer<RT> {
    return {
      behaviour,
      ruleError: { requirement: this.requirement, ruleHint: hint },
    } as GetFailRuleAnswer<RT>;
  }

  /** возвращает текст с вставленным значением */
  private static replaceByRegex(rawMessage: string, hintKey: string, value: string): string {
    return rawMessage.replace(this.getRegex(hintKey), value);
  }

  /** возвращает regex для формата "{{hint}}" */
  private static getRegex(hintKey: string): RegExp {
    // eslint-disable-next-line prefer-template, no-useless-escape
    return RegExp('[{]{2}\s*' + hintKey + '\s*[}]{2}');
  }
}
