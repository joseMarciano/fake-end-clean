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
    test('Should return an User on signup success', async () => {
      const response = await request(app)
        .post(`${env.defaultPath}/signup`)
        .send({
          email: 'marcianojosepaulo@email.com',
          name: 'marcianojosepaulo',
          password: '123',
          passwordConfirmation: '123'
        })

      expect(response.status).toBe(200)
      expect(response.body).toBeTruthy()
      expect(response.body.id).toBeTruthy()
      expect(response.body.email).toBe('marcianojosepaulo@email.com')
      expect(response.body.name).toBe('marcianojosepaulo')
      expect(response.body.password).toBe('123')
    })
  })
})
