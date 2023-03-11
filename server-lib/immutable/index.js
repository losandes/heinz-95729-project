import { PolynImmutable } from '@polyn/immutable'

const polyn = PolynImmutable({
  Validator: function (_name, zModel) {
    return {
      validate: (input) => ({
        value: zModel.parse(input),
      }),
    }
  },
})

export const immutable = polyn.immutable
export default immutable
