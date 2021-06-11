import { AccountModel } from '../../../domain/models/account'
import { AuthParams } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/crypto/hash-comparer'
import { TokenGenerator } from '../../protocols/crypto/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-by-email-repository'
import {
  UpdateAccessTokenModel,
  UpdateAccessTokenRepository
} from '../../protocols/db/account/update-access-token-repository'
import { DbAuthentication } from './db-authentication'

const makeFakeAuthParams = (): AuthParams => ({
  email: 'any_email@email.com',
  password: 'any_password'
})

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@email.com',
  password: 'hashed_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      return await new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return await new Promise((resolve) => resolve(true))
    }
  }
  return new HashComparerStub()
}

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generateToken(value: string): Promise<string> {
      return await new Promise((resolve) => resolve('any_token'))
    }
  }
  return new TokenGeneratorStub()
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(
      updateAccessToken: UpdateAccessTokenModel
    ): Promise<void> {
      return await new Promise((resolve) => resolve())
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepository: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()
  const updateAccessTokenRepository = makeUpdateAccessTokenRepository()

  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepository
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepository
  }
}

describe('DbAuthentication UseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(
      loadAccountByEmailRepositoryStub,
      'loadByEmail'
    )
    const authParams = makeFakeAuthParams()
    await sut.auth(authParams)
    expect(loadByEmailSpy).toHaveBeenLastCalledWith(authParams.email)
  })

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.auth(makeFakeAuthParams())
    expect(promise).rejects.toThrow()
  })

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(null)
    const authParams = makeFakeAuthParams()
    const accessToken = await sut.auth(authParams)
    expect(accessToken).toBe(null)
  })

  it('should call HashComparer with correct password', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    const authParams = makeFakeAuthParams()
    await sut.auth(authParams)
    expect(compareSpy).toHaveBeenLastCalledWith(
      authParams.password,
      'hashed_password'
    )
  })

  it('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.auth(makeFakeAuthParams())
    expect(promise).rejects.toThrow()
  })

  it('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)))
    const authParams = makeFakeAuthParams()
    const accessToken = await sut.auth(authParams)
    expect(accessToken).toBe(null)
  })

  it('should call TokenGenerator with correct account id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generateToken')
    const authParams = makeFakeAuthParams()
    await sut.auth(authParams)
    expect(generateSpy).toHaveBeenLastCalledWith('any_id')
  })

  it('should throw if  TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest
      .spyOn(tokenGeneratorStub, 'generateToken')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.auth(makeFakeAuthParams())
    expect(promise).rejects.toThrow()
  })

  it('should return access token if TokenGenerator called with valid id', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthParams())
    expect(accessToken).toBe('any_token')
  })

  it('should call UpdateAccessTokenRepository with account id and token', async () => {
    const { sut, updateAccessTokenRepository } = makeSut()
    const updateSpy = jest.spyOn(
      updateAccessTokenRepository,
      'updateAccessToken'
    )
    const authParams = makeFakeAuthParams()
    await sut.auth(authParams)
    expect(updateSpy).toHaveBeenLastCalledWith({
      accountId: 'any_id',
      token: 'any_token'
    })
  })
})
