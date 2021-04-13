import request from 'supertest'
import { mongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env?.MONGO_URL as string)
  })
  afterAll(async () => {
    await mongoHelper.disconnect()
  })
  beforeEach(async () => {
    const accountCollection = mongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

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
})
