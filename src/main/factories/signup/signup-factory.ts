import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BCryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-repository'
import { SignUpController } from '../../../presentation/controllers/signup/sign-up-controller'
import { Controller } from '../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const saltRoutes = 12
  const hasher = new BCryptAdapter(saltRoutes)
  const accountRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(hasher, accountRepository)
  const signUpController = new SignUpController(
    dbAddAccount,
    makeSignUpValidation()
  )
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
