import { mongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('AccountMongoRepository', () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env?.MONGO_URL as string)
  })
  afterAll(async () => {
    await mongoHelper.disconnect()
  })
  beforeEach(async () => {
    const accountCollection = await mongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => new AccountMongoRepository()

  it('should insert and return an account successfully', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@email.com')
    expect(account.password).toBe('any_password')
  })
})
