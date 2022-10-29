// const messageId: MessageIds = 'spike';

import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/utils';
import type { MessageIds } from '../../../src/rules/declarative-inject-in-class';

const messageId_injectOnlyOnTop: MessageIds = 'injectOnlyOnTop';
const messageId_injectOnlyForPropertyDefinition: MessageIds =
  'injectOnlyForPropertyDefinition';

export const valid = [
  `
  class TestClass {
    a = inject(TOKEN);
  }
  `,
  `
  class TestClass {
    a = inject(TOKEN);
    b = inject(TOKEN);
  }
  `,
  `
  class TestClass {
    a = inject(TOKEN);
    b = 1;
  }
  `,
  `
  class TestClass {
    a = inject(TOKEN);
    b() {};
  }
  `,
  `
  class TestClass {
    a = inject(TOKEN);
    b = inject(TOKEN);
    c() {};
  }
  `,
  `
  class TestClass {
    a = inject(TOKEN);
    b = inject(TOKEN);
    constructor(deps) {}
  }
  `,
];

export const invalid = [
  convertAnnotatedSourceToFailureCase({
    description: 'should fail if inject used after a constructor',
    annotatedSource: `
    class TestClass {
      constructor(args) {}
      a = inject(TOKEN);
      ~~~~~~~~~~~~~~~~~~
    }
    `,
    messageId: messageId_injectOnlyOnTop,
  }),
  convertAnnotatedSourceToFailureCase({
    description: 'should fail if inject used after a method',
    annotatedSource: `
    class TestClass {
      method(args) {}
      a = inject(TOKEN);
      ~~~~~~~~~~~~~~~~~~
    }
    `,
    messageId: messageId_injectOnlyOnTop,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'should fail if inject used after a property that does not use inject',
    annotatedSource: `
    class TestClass {
      b = 1
      a = inject(TOKEN);
      ~~~~~~~~~~~~~~~~~~
    }
    `,
    messageId: messageId_injectOnlyOnTop,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'should fail if inject used after a property that does not use inject',
    annotatedSource: `
    class TestClass {
      a = inject(TOKEN);
      b = 1
      c = inject(TOKEN);
      ~~~~~~~~~~~~~~~~~~
    }
    `,
    messageId: messageId_injectOnlyOnTop,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'should fail if inject used after a property that does not use inject and a method',
    annotatedSource: `
    class TestClass {
      a = inject(TOKEN);
      b = 1;
      c() {}
      d = inject(TOKEN);
      ~~~~~~~~~~~~~~~~~~
    }
    `,
    messageId: messageId_injectOnlyOnTop,
  }),
  convertAnnotatedSourceToFailureCase({
    description: 'should fail if inject is used inside an arrow function',
    annotatedSource: `
    class TestClass {
      a = () => inject(TOKEN);
                ~~~~~~~~~~~~~
    }
    `,
    messageId: messageId_injectOnlyForPropertyDefinition,
  }),
  convertAnnotatedSourceToFailureCase({
    description: 'should fail if inject is used together with method call',
    annotatedSource: `
    class TestClass {
      a = inject(Service).method();
          ~~~~~~~~~~~~~~~
    }
    `,
    messageId: messageId_injectOnlyForPropertyDefinition,
  }),
  convertAnnotatedSourceToFailureCase({
    description: 'should fail if inject is used together with property access',
    annotatedSource: `
    class TestClass {
      a = inject(Service).property;
          ~~~~~~~~~~~~~~~
    }
    `,
    messageId: messageId_injectOnlyForPropertyDefinition,
  }),
  convertAnnotatedSourceToFailureCase({
    description: 'should fail if inject is used inside other function call',
    annotatedSource: `
    class TestClass {
      a = of(inject(Service));
             ~~~~~~~~~~~~~~~
    }
    `,
    messageId: messageId_injectOnlyForPropertyDefinition,
  }),
  convertAnnotatedSourceToFailureCase({
    description: 'should fail if inject is used inside stream logic',
    annotatedSource: `
    class TestClass {
      a = stream.pipe(
            map(() => inject(Service))
                      ~~~~~~~~~~~~~~~
          );
    }
    `,
    messageId: messageId_injectOnlyForPropertyDefinition,
  }),
];
