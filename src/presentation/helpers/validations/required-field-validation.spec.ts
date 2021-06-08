import MissingParamError from '../../errors/missing-param-error'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): RequiredFieldValidation =>
  new RequiredFieldValidation('field')

describe('RequiredFieldValidation', () => {
  it('should return MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ name: '' })
    expect(error).toEqual(new MissingParamError('field'))
  })
  it('should return nothing if validation is succesfull', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_name' })
    expect(error).toBeFalsy()
  })
})
