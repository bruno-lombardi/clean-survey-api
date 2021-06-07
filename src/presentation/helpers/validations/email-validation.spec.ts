import { EmailValidator } from '../../protocols/email-validator'
import InvalidParamError from '../../errors/invalid-param-error'

import { EmailValidation } from './email-validation'

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeFakeEmail = (): { email: string } => ({
  email: 'any_email@email.com'
})

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation(emailValidatorStub, 'email')
  return {
    sut,
    emailValidatorStub
  }
}

describe('EmailValidation', () => {
  it('should return error if EmailValidator returns false', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const fakeEmail = makeFakeEmail()
    const error = sut.validate(fakeEmail)
    expect(error).toEqual(new InvalidParamError('email'))
  })
  it('should call EmailValidator isValid with correct value', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const fakeEmail = makeFakeEmail()
    sut.validate(fakeEmail)
    expect(isValidSpy).toHaveBeenCalledWith(fakeEmail.email)
  })
  it('should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const fakeEmail = makeFakeEmail()
    sut.validate(fakeEmail)
    expect(isValidSpy).toHaveBeenCalledWith(fakeEmail.email)
  })
})
