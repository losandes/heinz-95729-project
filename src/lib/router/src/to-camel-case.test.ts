import { test } from 'vitest'
import toCamelCase from './to-camel-case'

const given = 'given routing::toCamelCase'
//   Case: [T: subject-under-test, string: expected result]
type Case<T> = [T, string]

test.concurrent([given,
  'when a string written in kebab case is presented',
  'it should remove the hyphens and capitalize the letters that follow them',
].join(', '), ({ expect }) => {
  const happyPaths: Case<string>[] = [
    ['convert-kebab-case-to-camel-case', 'convertKebabCaseToCamelCase'],
    ['convert_snake_case_to_camel_case', 'convertSnakeCaseToCamelCase'],
    ['ConvertPascalCaseToCamelCase', 'convertPascalCaseToCamelCase'],
    ['slashes-should-be/ignored', 'slashesShouldBe/ignored'],
    ['--leading-hyphens-should-be-removed', 'leadingHyphensShouldBeRemoved'],
    ['__leading_underscores_should_be_removed', 'leadingUnderscoresShouldBeRemoved'],
    ['trailing-hyphens-should-be-removed--', 'trailingHyphensShouldBeRemoved'],
    ['trailing_underscores_should_be_removed__', 'trailingUnderscoresShouldBeRemoved'],
    ['multiple--dashes--should-be-dealt-with', 'multipleDashesShouldBeDealtWith'],
    ['multiple---dashes---should-be-dealt-with', 'multipleDashesShouldBeDealtWith'],
    ['multiple__underscores__should_be_dealt_with', 'multipleUnderscoresShouldBeDealtWith'],
    ['multiple___underscores___should_be_dealt_with', 'multipleUnderscoresShouldBeDealtWith'],
    ['First-capital-letters-should-be-converted', 'firstCapitalLettersShouldBeConverted'],
  ]

  happyPaths.forEach(([sut, expected]) => {
    expect(toCamelCase(sut)).toEqual(expected)
  })
})

test.concurrent([given,
  'when an invalid value is presented',
  'it should throw the expected error message',
].join(', '), ({ expect }) => {
  const negativePaths: Case<unknown>[] = [
    [null, 'Expected string, received null'],
    [undefined, 'Required'],
    [42, 'Expected string, received number'],
  ]

  negativePaths.forEach(([sut, errMessage]) => {
    // @ts-expect-error this tests js runtime type errors
    expect(() => { return toCamelCase(sut) }).toThrow(errMessage)
  })
})
