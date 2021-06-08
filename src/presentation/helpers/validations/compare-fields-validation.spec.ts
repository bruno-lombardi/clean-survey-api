import InvalidParamError from '../../errors/invalid-param-error'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation =>
  new CompareFieldsValidation('field', 'field_to_compare')

describe('RequiredFieldValidation', () => {
  it('should return InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_field' })
    expect(error).toEqual(new InvalidParamError('field'))
  })
  it('should return nothing if validation is succesfull', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'any_name',
      field_to_compare: 'any_name'
    })
    expect(error).toBeFalsy()
  })
})
