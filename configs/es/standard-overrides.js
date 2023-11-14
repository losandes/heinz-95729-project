export default {
  rules: {
    'comma-dangle': ['error', 'always-multiline'],                              // require trailing commas like airbnb and google rules
    'eol-last': ['error', 'always'],                                            // every file should have a new line at the end of the file: https://eslint.org/docs/latest/rules/eol-last
    'generator-star-spacing': ['error', 'after'],                               // `function*`, not `function *` for generators for comprehensibility
    'import/extensions': ['error', 'ignorePackages'],                           // require file extensions on imports, except for package imports
    'import/no-commonjs': 2,                                                    // force es6 import export declarations
    'import/no-unresolved': 2,                                                  // ensure that all imported modules can be resolved
    'linebreak-style': ["error", "unix"],                                       // All line endings need to be LF for .envrc to work. @see .editorconfig, .gitattributes, and .vscode/settings.json. :: @see https://www.aleksandrhovhannisyan.com/blog/crlf-vs-lf-normalizing-line-endings-in-git/ :: @see https://blog.boot.dev/clean-code/line-breaks-vs-code-lf-vs-crlf/ :: @see https://eslint.org/docs/latest/rules/linebreak-style
    'no-console': 'error',                                                      // Don't leave console.log statements anywhere... use the logger
    'no-multi-spaces': ['error', { 'ignoreEOLComments': true }],                // Allow extra spaces only for end-of-line comments (like this one)
    'no-redeclare': 'off',                                                      // doesn't support merging TS types with implementations (also see ./typescript.js::@typescript-eslint/no-redeclare)
  },
}
