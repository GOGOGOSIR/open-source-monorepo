import { addSum } from '@eric-wan/use'

export const getRes = (a: number, b: number) => {
  const sum = addSum(a, b)

  return sum * 2
}
