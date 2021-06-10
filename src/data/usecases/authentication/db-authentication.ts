import {
  Authentication,
  AuthParams
} from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async auth(authenticationParams: AuthParams): Promise<string> {
    await this.loadAccountByEmailRepository.loadByEmail(
      authenticationParams.email
    )
    return null
  }
}
