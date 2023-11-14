export default {
  rules: {
    'functional/functional-parameters': [
      'error',
      { 'enforceParameterCount': false },
    ],                                               // expect functional params (e.g. no addressing this.arguments), but don't require params @see https://github.com/eslint-functional/eslint-plugin-functional/blob/v5.0.7/docs/rules/functional-parameters.md
    'functional/immutable-data': [
      'error',
      { 'ignoreAccessorPattern': [                   // let properties whose names start with mutable or current (e.g. react's useRef) be mutated
          '**.current*',                             // uses globs, not RegExp
          '**.mutable*'
        ]
      },
    ],
    'functional/no-return-void': 'off',              // Several of the tools we use are not functional resulting in a lot of noise from this (e.g. vitest/jest)
    'functional/no-expression-statements': 'off',    // I'd rather just ignore this rule when calling void functions, but that only works with TypeScript. @see https://github.com/eslint-functional/eslint-plugin-functional/blob/v5.0.7/docs/rules/no-expression-statements.md
    'functional/no-let': [                           // let properties whose names start with mutable be mutated
      'error',
      { 'ignoreIdentifierPattern': ['^mutable'] },
    ],
    'functional/prefer-immutable-types': [
      'error', {
      enforcement: 'None',
      ignoreInferredTypes: true,
      ignoreNamePattern: ['^err'],                   // errors should not be made Readonly in TypeScript
      parameters: {
        enforcement: 'ReadonlyShallow',              // we don't control other people's code, so ReadonlyDeep results in lots of ignores
      },
    }],
  },
}
