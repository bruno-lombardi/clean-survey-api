import MissingParamError from '../../errors/missing-param-error'
import { Validation } from '../../protocols/validation'
import { ValidationComposite } from './validation-composite'

interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: Record<string, any>): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)

  return {
    sut,
    validationStubs
  }
}

describe('ValidationComposite', () => {
  it('should return error if one of the validations fail', () => {
    const { sut, validationStubs } = makeSut()
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockImplementationOnce(() => new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
  it('should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest
      .spyOn(validationStubs[0], 'validate')
      .mockImplementationOnce(() => new Error())
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockImplementationOnce(() => new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new Error())
  })
  it('should return nothing if validations are successfull', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
