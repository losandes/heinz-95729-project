import { test } from 'vitest'
import concatToOneLine from './concat-to-one-line'

type Case = {
  it: string
  param0: string | string[]
  param1?: string
  expected: string
}

const cases: Case[] = [
  {
    it: 'it should concatenate an array of strings into a single line',
    param0: ['flex', 'justify-center', 'items-center'],
    expected: 'flex justify-center items-center',
  },
  {
    it: 'it should remove line breaks from the input',
    param0: ['flex\njustify-center\nitems-center'],
    expected: 'flex justify-center items-center',
  },
  {
    it: 'it should remove multiple spaces from the input',
    param0: ['flex      justify-center      items-center'],
    expected: 'flex justify-center items-center',
  },
  {
    it: 'it should remove line breaks and multiple spaces from the input',
    param0: ['flex\njustify-center\nitems-center', 'flex \njustify-center\n  items-center'],
    expected: 'flex justify-center items-center flex justify-center items-center',
  },
  {
    it: 'it should ignore undefined values',
    // @ts-expect-error -- this is a negative path
    param0: [undefined, 'flex', 'justify-center', 'items-center'],
    expected: 'flex justify-center items-center',
  },
  {
    it: 'it should ignore null values',
    // @ts-expect-error -- this is a negative path
    param0: [null, 'flex', 'justify-center', 'items-center'],
    expected: 'flex justify-center items-center',
  },
  {
    it: 'it should ignore empty strings',
    param0: ['', '   ', 'flex', 'justify-center', 'items-center'],
    expected: 'flex justify-center items-center',
  },
  {
    it: 'it should behave the same way given two string arguments',
    param0: 'flex',
    param1: 'justify-center items-center',
    expected: 'flex justify-center items-center',
  },
]

test.concurrent([
  'given react-utils::concatToOneLine',
  'when it is called with an array of strings',
].join(', '), ({ expect }) => {
  cases.forEach(({ it, param0, param1, expected }) => {
    // when
    const actual = concatToOneLine(param0, param1)

    // then
    expect(actual, it).toEqual(expected)
  })
})
