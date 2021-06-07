import { Validation } from '../../protocols/validation'

/**
 * Composite pattern
 * Use composition to compose multiple validations to run
 */
export class ValidationComposite implements Validation {
  constructor(private readonly validations: Validation[]) {}

  validate(input: Record<string, any>): Error {
    for (const validation of this.validations) {
      const error = validation.validate(input)
      if (error) {
        return error
      }
    }
  }
}
