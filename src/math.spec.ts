import { div, mult, sqr, sub, sum } from './math'

describe('math', () => {
  test('should add numbers', () => {
    expect(sum(3, 5, 1)).toBe(9)
  })
  test('should subtract numbers', () => {
    expect(sub(12, 5, 1)).toBe(6)
  })
  test('should multiply numbers', () => {
    expect(mult(10, 12)).toBe(120)
  })
  test('should divide numbers', () => {
    expect(div(8, 2)).toBe(4)
  })
  test('should get square of number', () => {
    expect(sqr(144)).toBe(12)
  })
})
