import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BCryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { SignUpController } from '../../presentation/controllers/sign-up-controller'
import { Controller } from '../../presentation/protocols/controller'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log'

export const makeSignUpController = (): Controller => {
  const emailValidator = new EmailValidatorAdapter()
  const saltRoutes = 12
  const encrypter = new BCryptAdapter(saltRoutes)
  const accountRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(encrypter, accountRepository)
  const signUpController = new SignUpController(emailValidator, dbAddAccount)
  return new LogControllerDecorator(signUpController)
}
