export function sum(...values: number[]): number {
  return values.reduce((x, y) => x + y)
}

export function sub(...values: number[]): number {
  return values.reduce((x, y) => x - y)
}

export function mult(...values: number[]): number {
  return values.reduce((x, y) => x * y)
}

export function div(x: number, y: number): number {
  return x / y
}

export function sqr(value: number): number {
  return Math.sqrt(value)
}