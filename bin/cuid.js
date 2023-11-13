#!/usr/bin/env node

/*
 * Generates a CUID2 and prints it to the console
 * @see https://github.com/paralleldrive/cuid2
 *
 * -c,  --count       the number of ids to generate
 * -l,  --length      print random id(s) of the given length
 *                    - must be divisible to a whole integer by 2
 *                    - expects length to be the next arg: \`cuid -l 8\`
 * -p,  --prefix      prepend the id with the given prefix
 *                    - expects prefix to be the next arg: \`cuid -p MYPREFIX-\`
 *
 * Usage:
 *  $ cuid
 *    j3k0al3nmh48yvkwqm5qanj2
 *  $ cuid --length 8 --prefix u --count 10
 *    ua8v4qiv1
 *    ufxd9pfuf
 *    uuijof4pi
 *    ugofurmgs
 *    uyqcx0bs7
 *    ua8u3lg13
 *    unxl0iz9a
 *    uccfifcln
 *    uga8hq2ih
 *    usnoxvmtl
 *  $ cuid -l 8 -p u -c 10
 *    _prints same as previous example_
 */

import { createId, init } from '@paralleldrive/cuid2'

// args ========================================================================

function Switch (lowercaseLetter) {
  return { switch: `-${lowercaseLetter}`.toUpperCase() }
}

function Swatch (name) {
  return { switch: `--${name}`.toUpperCase() }
}

function Option (lowercaseLetter, name) {
  return {
    switch: Switch(lowercaseLetter).switch,
    option: Swatch(name).switch
  }
}

const findMatch = (switchesOrOptions, argValue, idx, args) => {
  const target = switchesOrOptions
  const _argValue = argValue.trim().toUpperCase()

  if (
    target.option &&
    args.length >= idx + 2 && ( // length is 1 based, and idx is 0 based so add 2
      target.option === _argValue ||
      target.switch === _argValue
    )
  ) {
    return args[idx + 1]
  } else if (
    target.switch === _argValue ||
    target.option === _argValue
  ) {
    return true
  }

  return false
}

const printHelp = () => console.log(`
Generates a CUID2 and prints it to the console
@see https://github.com/paralleldrive/cuid2

-c,  --count       the number of ids to generate
-l,  --length      print random id(s) of the given length
                   - must be divisible to a whole integer by 2
                   - expects length to be the next arg: \`cuid -l 8\`
-p,  --prefix      prepend the id with the given prefix
                   - expects prefix to be the next arg: \`cuid -p MYPREFIX-\`

Usage:
 $ cuid
   j3k0al3nmh48yvkwqm5qanj2
 $ cuid --length 8 --prefix u --count 10
   ua8v4qiv1
   ufxd9pfuf
   uuijof4pi
   ugofurmgs
   uyqcx0bs7
   ua8u3lg13
   unxl0iz9a
   uccfifcln
   uga8hq2ih
   usnoxvmtl
 $ cuid -l 8 -p u -c 10
   _prints same as previous example_
`) // /console.log(help)

function Options () {
  let count = 1
  let length = 0
  let prefix = (input) => input
  let isHelp = false

  process.argv.forEach((value, idx, args) => {
    const carg = findMatch(Option('c', 'count'), value, idx, args)
    const larg = findMatch(Option('l', 'length'), value, idx, args)
    const parg = findMatch(Option('p', 'prefix'), value, idx, args)

    if (carg) {
      const c = parseInt(carg)
      if (!isNaN(c) && c > 0) count = c
    }

    if (larg) {
      const l = parseInt(larg)
      if (!isNaN(l)) length = l
    }

    if (parg) prefix = (input) => `${parg}${input}`

    if (value === 'help' || value === '-h' || value === '--help')
      isHelp = true
  })

  return Object.freeze({
    count,
    length,
    prefix,
    isHelp
  })
}

// main ========================================================================

function main () {
  const {
    count,
    length,
    prefix,
    isHelp
  } = new Options()

  if (isHelp) {
    printHelp()
    process.exit(0)
  }

  const makeId = length > 0
    ? init({
      // A custom random function with the same API as Math.random.
      // You should use this to pass a cryptographically secure random function.
      // random: Math.random,
      length, // the length of the id
      // fingerprint: 'a-custom-host-fingerprint',
    })
    : createId

  for (let i = 0; i < count; i += 1) {
    console.log(prefix(makeId()))
  }
}

main()
