import InvalidParamError from '../../errors/invalid-param-error'
import { EmailValidator } from '../../protocols/email-validator'
import { Validation } from '../../protocols/validation'

export class EmailValidation implements Validation {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly fieldName: string
  ) {}

  validate(input: Record<string, any>): Error {
    const isEmailValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isEmailValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
