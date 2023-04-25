import { RuleTester } from '@angular-eslint/utils';
import rule, {
  RULE_NAME,
} from '../../../src/rules/declarative-inject-in-class';
import { invalid, valid } from './cases';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run(RULE_NAME, rule, {
  valid,
  invalid,
});
