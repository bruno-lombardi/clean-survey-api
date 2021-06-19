import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'
import {
  UpdateAccessTokenModel,
  UpdateAccessTokenRepository
} from '../../../../data/protocols/db/account/update-access-token-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { mongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await mongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    return mongoHelper.map<AccountModel>(result.ops[0])
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await mongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return mongoHelper.map<AccountModel>(account)
  }

  async updateAccessToken(
    updateAccessTokenModel: UpdateAccessTokenModel
  ): Promise<void> {
    const accountCollection = await mongoHelper.getCollection('accounts')
    const { accountId, token } = updateAccessTokenModel
    await accountCollection.updateOne(
      { _id: accountId },
      { $set: { accessToken: token } }
    )
  }
}
