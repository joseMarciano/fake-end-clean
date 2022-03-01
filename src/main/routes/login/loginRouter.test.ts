import { app } from '../../config/app'
import request from 'supertest'
import { MongoHelper } from '../../../infra/db/mongo/mongoHelper'
import { JwtAdapter } from '../../../infra/cryptography/jwt/JwtAdapter'
import { Collection, ObjectId } from 'mongodb'

let userCollection: Collection
const defaultPath = process.env.DEFAULT_PATH as string
const jwtAdapter = new JwtAdapter('secret')

describe('loginRouter', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    userCollection = await MongoHelper.getCollection('users')
    await userCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    // TODO: ADD VALIDATION TESTS LIKE 400 RETURNS
    test('Should return an 204 on signup success', async () => {
      const response = await request(app)
        .post(`${defaultPath}/signup`)
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

  describe('GET /active', () => {
    // TODO: ADD VALIDATION TESTS LIKE 403 RETURNS/ 302 RETURNS
    const makeFakeUserParam = async (): Promise<string> => {
      return await jwtAdapter.encrypt({
        email: 'any_email@mail.com',
        password: '123456789'
      })
    }

    const insertFakeUser = async (): Promise<string> => {
      const userCollection = await MongoHelper.getCollection('users')
      const result = await userCollection.insertOne({
        name: 'Josefh',
        email: 'any_email@mail.com',
        password: '123456789'
      })

      return result.insertedId.toString()
    }

    const insertFakeUserAccessToken = async (userId: string, accessToken: string): Promise<void> => {
      const userAccessTokenCollection = await MongoHelper.getCollection('usersAccessToken')
      await userAccessTokenCollection.insertOne({
        userId,
        accessToken,
        createdAt: new Date()
      })
    }

    test('Should return an 200 on active success', async () => {
      const userId = await insertFakeUser()
      const accessToken = await makeFakeUserParam()
      await insertFakeUserAccessToken(userId, accessToken)

      const response = await request(app)
        .get(`${defaultPath}/active`)
        .query({ user: accessToken })
        .send()
      expect(response.status).toBe(200)
    })
  })

  describe('POST /login', () => {
    let insertedId: string
    const insertFakeUser = async (): Promise<string> => {
      const userCollection = await MongoHelper.getCollection('users')
      const result = await userCollection.insertOne({
        name: 'Josefh',
        email: 'any_email@mail.com',
        password: '$2a$12$HALpxOxdmI6cBGPu7LIoO.lAw0Lqy.rpGWoCl5FM9GZzXowG7n.9S'
      })

      return result.insertedId.toString()
    }

    beforeEach(async () => {
      insertedId = await insertFakeUser()
    })

    afterEach(async () => {
      await userCollection.deleteOne({ _id: new ObjectId(insertedId) })
    })

    test('Should return an 200 on login success', async () => {
      const response = await request(app)
        .post(`${defaultPath}/login`)
        .send({ email: 'any_email@mail.com', password: '123456789' })

      expect(response.status).toBe(200)
    })
  })
})
