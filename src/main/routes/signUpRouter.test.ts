import { app } from '../config/app'
import request from 'supertest'
import env from '../config/env'
import { MongoHelper } from '../../infra/db/mongo/mongoHelper'

describe('signUpRouter', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const userCollection = await MongoHelper.getCollection('users')
    await userCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return an 204 on signup success', async () => {
      const response = await request(app)
        .post(`${env.defaultPath}/signup`)
        .send({
          email: 'marcianojosepaulo@email.com',
          name: 'marcianojosepaulo',
          password: '123',
          passwordConfirmation: '123'
        })

      expect(response.status).toBe(204)
      expect(response.body).toEqual({})
    })
  })
})
