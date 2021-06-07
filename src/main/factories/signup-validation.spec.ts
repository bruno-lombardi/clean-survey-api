import { RequiredFieldValidation } from '../../presentation/helpers/validations/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validations/validation-composite'
import { Validation } from '../../presentation/protocols/validation'
import { makeSignUpValidation } from './signup-validation'

// Mock a module
jest.mock('../../presentation/helpers/validations/validation-composite')

describe('makeSignUpValidation factory', () => {
  it('should call Validation Composite with all needed validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of [
      'name',
      'email',
      'password',
      'password_confirmation'
    ]) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
