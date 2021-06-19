import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'
import { AccountModel } from '../../domain/models/account'
import { mongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env?.MONGO_URL)
  })
  afterAll(async () => {
    await mongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = await mongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    it('should return 200 on POST /api/signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Bruno',
          email: 'bruno@kuppi.com.br',
          password: '321123',
          password_confirmation: '321123'
        })
        .expect(200)
    })
    it('should return an account on POST /api/signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Bruno',
          email: 'bruno@kuppi.com.br',
          password: '321123',
          password_confirmation: '321123'
        })
        .expect(200)
        .then((res) => {
          const account: AccountModel = res.body
          expect(account.id).toBeTruthy()
          expect(account.name).toBe('Bruno')
          expect(account.email).toBe('bruno@kuppi.com.br')
        })
    })
  })
  describe('POST /login', () => {
    it('should return 200 on POST /api/login', async () => {
      const password = await hash('123456', 12)
      await accountCollection.insertOne({
        name: 'Bruno',
        email: 'bruno@kuppi.com.br',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'bruno@kuppi.com.br',
          password: '123456'
        })
        .expect(200)
    })
    it('should return an access token on POST /api/login', async () => {
      const password = await hash('123456', 12)

      await accountCollection.insertOne({
        name: 'Bruno',
        email: 'bruno@kuppi.com.br',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'bruno@kuppi.com.br',
          password: '123456'
        })
        .expect(200)
        .then((res) => {
          const accessToken = res.body.accessToken
          expect(accessToken).toBeTruthy()
        })
    })
  })
})
