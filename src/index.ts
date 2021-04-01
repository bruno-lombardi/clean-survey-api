export function sum (...values: number[]): number {
  return values.reduce((x, y) => x + y)
}
