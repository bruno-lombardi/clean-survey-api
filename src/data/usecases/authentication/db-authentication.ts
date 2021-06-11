import {
  Authentication,
  AuthParams
} from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/crypto/hash-comparer'
import { TokenGenerator } from '../../protocols/crypto/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../protocols/db/account/update-access-token-repository'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
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
        const accessToken = await this.tokenGenerator.generateToken(account.id)
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
