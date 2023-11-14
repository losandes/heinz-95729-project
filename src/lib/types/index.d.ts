/** Adds support for up to 8 levels of curring */
type Curry1<A, R> = (a: A) => R;

type Curry2<A, B, R> = {
  (a: A, b: B): R
  (a: A): Curry1<B, R>
}

type Curry3<A, B, C, R> = {
  (a: A, b: B, c: C): R
  (a: A, b: B): Curry1<C, R>
  (a: A): Curry2<B, C, R>
}

type Curry4<A, B, C, D, R> = {
  (a: A, b: B, c: C, d: D): R
  (a: A, b: B, c: C): Curry1<D, R>
  (a: A, b: B): Curry2<C, D, R>
  (a: A): Curry3<B, C, D, R>
}

type Curry5<A, B, C, D, E, R> = {
  (a: A, b: B, c: C, d: D, e: E): R
  (a: A, b: B, c: C, d: D): Curry1<E, R>
  (a: A, b: B, c: C): Curry2<D, E, R>
  (a: A, b: B): Curry3<C, D, E, R>
  (a: A): Curry4<B, C, D, E, R>
}

type Curry6<A, B, C, D, E, F, R> = {
  (a: A, b: B, c: C, d: D, e: E, f: F): R
  (a: A, b: B, c: C, d: D, e: E): Curry1<F, R>
  (a: A, b: B, c: C, d: D): Curry2<E, F, R>
  (a: A, b: B, c: C): Curry3<D, E, F, R>
  (a: A, b: B): Curry4<C, D, E, F, R>
  (a: A): Curry5<B, C, D, E, F, R>
}

type Curry7<A, B, C, D, E, F, G, R> = {
  (a: A, b: B, c: C, d: D, e: E, f: F, g: G): R
  (a: A, b: B, c: C, d: D, e: E, f: F): Curry1<G, R>
  (a: A, b: B, c: C, d: D, e: E): Curry2<F, G, R>
  (a: A, b: B, c: C, d: D): Curry3<E, F, G, R>
  (a: A, b: B, c: C): Curry4<D, E, F, G, R>
  (a: A, b: B): Curry5<C, D, E, F, G, R>
  (a: A): Curry6<B, C, D, E, F, G, R>
}

type Curry8<A, B, C, D, E, F, G, H, R> = {
  (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H): R
  (a: A, b: B, c: C, d: D, e: E, f: F, g: G): Curry1<H, R>
  (a: A, b: B, c: C, d: D, e: E, f: F): Curry2<G, H, R>
  (a: A, b: B, c: C, d: D, e: E): Curry3<F, G, H, R>
  (a: A, b: B, c: C, d: D): Curry4<E, F, G, H, R>
  (a: A, b: B, c: C): Curry5<D, E, F, G, H, R>
  (a: A, b: B): Curry6<C, D, E, F, G, H, R>
  (a: A): Curry7<B, C, D, E, F, G, H, R>
}

/**
 * A curried equivalent of the log.emit function that supports up to 8
 * args/function. The curried function has two unusual capabilities.
 * First, its arguments needn't be provided one at a time. If `f` is a
 * ternary function and `g` is `R.curry(f)`, the following are equivalent:
 *
 * ```
 * g(1)(2)(3)
 * g(1)(2, 3)
 * g(1, 2)(3)
 * g(1, 2, 3)
 * ```
 *
 * i.e.:
 *
 * ```
 * type AddThreeNumbers = Curry<[
 *   number,
 *   number,
 *   number
 * ], number>
 * const addThreeNumbers: AddThreeNumbers = R.curry((
 *   a: number,
 *   b: number,
 *   c: number,
 * ) => a + b + c)
 *
 * addThreeNumbers(1)(2)(3) // => 6
 * addThreeNumbers(1)(2, 3) // => 6
 * addThreeNumbers(1, 2)(3) // => 6
 * addThreeNumbers(1, 2, 3) // => 6
 * ```
 *
 * @see https://ramdajs.com/docs/#curry
 */
export type Curry <T, R> =
  T extends [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown] ? Curry8<T[0], T[1], T[2], T[3], T[4], T[5], T[6], T[7], R> :
  T extends [unknown, unknown, unknown, unknown, unknown, unknown, unknown] ? Curry7<T[0], T[1], T[2], T[3], T[4], T[5], T[6], R> :
  T extends [unknown, unknown, unknown, unknown, unknown, unknown] ? Curry6<T[0], T[1], T[2], T[3], T[4], T[5], R> :
  T extends [unknown, unknown, unknown, unknown, unknown] ? Curry5<T[0], T[1], T[2], T[3], T[4], R> :
  T extends [unknown, unknown, unknown, unknown] ? Curry4<T[0], T[1], T[2], T[3], R> :
  T extends [unknown, unknown, unknown] ? Curry3<T[0], T[1], T[2], R> :
  T extends [unknown, unknown] ? Curry2<T[0], T[1], R> :
  T extends [unknown] ? Curry1<T[0], R> :
  unknown
;
