export interface Validation {
  validate: (input: Record<string, any>) => Error
}
