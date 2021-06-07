export default class UnauthorizedError extends Error {
  constructor(stack?: string) {
    super(`Unauthorized`)
    this.name = 'UnauthorizedError'
    this.stack = stack
  }
}
