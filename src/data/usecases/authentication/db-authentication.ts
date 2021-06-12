import {
  Authentication,
  AuthParams
} from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/crypto/hash-comparer'
import { Encrypter } from '../../protocols/crypto/encrypter'
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../protocols/db/account/update-access-token-repository'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(authenticationParams: AuthParams): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      authenticationParams.email
    )
    if (account) {
      const isValid = await this.hashComparer.compare(
        authenticationParams.password,
        account.password
      )

      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken({
          accountId: account.id,
          token: accessToken
        })
        return accessToken
      }
    }
    return null
  }
}
