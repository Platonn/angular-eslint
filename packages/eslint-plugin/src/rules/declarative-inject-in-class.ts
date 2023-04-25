import type { TSESTree } from '@typescript-eslint/utils';
import { createESLintRule } from '../utils/create-eslint-rule';

type Options = [];
export type MessageIds = 'injectOnlyOnTop' | 'injectOnlyForPropertyDefinition';
export const RULE_NAME = 'declarative-inject-in-class';

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'The function `inject` should be used in classes only to declare dependencies at the top of the class body. It should not be entangled with any custom logic.',
      recommended: false,
    },
    schema: [],
    messages: {
      injectOnlyOnTop:
        'The function `inject` should be called only on top of the class body.',
      injectOnlyForPropertyDefinition:
        'The function `inject` used in a class body should be called only for property initialization.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      // injectOnlyForPropertyDefinition
      [`ClassBody :not(PropertyDefinition) > CallExpression[callee.name='inject']`]:
        (node: TSESTree.ClassDeclaration) => {
          context.report({
            node: node,
            messageId: 'injectOnlyForPropertyDefinition',
          });
        },

      //
      [`ClassBody`]: (node: TSESTree.ClassBody) => {
        const elements = node.body;

        // array of booleans, each one indicating if the element
        // is a property definition calling `inject` function
        const elements_isPropertyDefinitionCallingInject: boolean[] =
          elements.map(isPropertyDefinitionCallingInject);

        // Check if all property definitions calling `inject` are grouped
        // on the top of the class body.
        // In other words: when an element a first one that is not a property definition
        // calling `inject`, later elements should not be property definitions calling `inject`.
        let isInjectAllowed = true;
        for (let i = 0; i < elements.length; i++) {
          if (elements_isPropertyDefinitionCallingInject[i]) {
            if (!isInjectAllowed) {
              context.report({
                node: elements[i],
                messageId: 'injectOnlyOnTop',
              });
            }
          } else {
            isInjectAllowed = false;
          }
        }
      },
    };
  },
});

/**
 * Checks if the given element is a `PropertyDefinition` with `CallExpression`
 * calling `inject` function.
 *
 * In other words, it checks if it looks like:
 *
 * ```ts
 * someProperty = inject(something);
 * ```
 */
function isPropertyDefinitionCallingInject(element: TSESTree.Node): boolean {
  return (
    element.type === 'PropertyDefinition' &&
    element?.value?.type === 'CallExpression' &&
    element.value.callee.type === 'Identifier' &&
    element.value.callee?.name === 'inject'
  );
}
