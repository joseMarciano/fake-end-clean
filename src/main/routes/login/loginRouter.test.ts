import { app } from '../../config/app'
import request from 'supertest'
import { MongoHelper } from '../../../infra/db/mongo/mongoHelper'
import { JwtAdapter } from '../../../infra/cryptography/jwt/JwtAdapter'
import { Collection, ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'
import { validate } from 'uuid'

let userCollection: Collection
let userAccessCollection: Collection
const defaultPath = process.env.DEFAULT_PATH as string
const jwtAdapter = new JwtAdapter('secret')

const connectDb = async (): Promise<void> => {
  await MongoHelper.connect(process.env.MONGO_URL as string)
}

const disconnectDb = async (): Promise<void> => {
  await MongoHelper.disconnect()
}

const clearCollections = async (): Promise<void> => {
  userCollection = await MongoHelper.getCollection('users')
  userAccessCollection = await MongoHelper.getCollection('usersAccessToken')
  await userCollection.deleteMany({})
  await userAccessCollection.deleteMany({})
}

describe('loginRouter', () => {
  beforeAll(async () => {
    await connectDb()
    await clearCollections()
  })

  afterAll(async () => {
    await disconnectDb()
  })

  describe('POST /signup', () => {
    beforeEach(async () => {
      await clearCollections()
    })

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

    test('Should return an 400 if no name is provided', async () => {
      const response = await request(app)
        .post(`${defaultPath}/signup`)
        .send({
          email: 'marcianojosepaulo@email.com',
          password: '123',
          passwordConfirmation: '123'
        })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ message: 'Missing param: name', error: 'MissingParamError' })
    })
  })

  describe('GET /active', () => {
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

    beforeEach(async () => {
      await clearCollections()
    })

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
      const result = await userCollection.insertOne({
        name: 'Josefh',
        email: 'any_email@mail.com',
        password: '$2a$12$HALpxOxdmI6cBGPu7LIoO.lAw0Lqy.rpGWoCl5FM9GZzXowG7n.9S',
        isActive: true
      })

      return result.insertedId.toString()
    }

    const createLoginBody = (): any => ({
      email: 'any_email@mail.com',
      password: '123456789'
    })

    beforeEach(async () => {
      await clearCollections()
      insertedId = await insertFakeUser()
    })

    test('Should return an 200 on login success', async () => {
      const response = await request(app)
        .post(`${defaultPath}/login`)
        .send(createLoginBody())
      console.log(response.body)
      expect(response.status).toBe(200)
    })

    test('Should return an accessToken if password not match', async () => {
      const response = await request(app)
        .post(`${defaultPath}/login`)
        .send(createLoginBody())

      expect(response.status).toBe(200)
      expect(jwt.verify(response.body.accessToken, process.env.JWT_SECRET_KEY as string)).toBeTruthy()
      expect(validate(response.body.refreshToken)).toBeTruthy()
    })

    test('Should return an 400 if no email is provided', async () => {
      const response = await request(app)
        .post(`${defaultPath}/login`)
        .send({ password: '123456789' })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ message: 'Missing param: email', error: 'MissingParamError' })
    })

    test('Should return an 400 if no password is provided', async () => {
      const response = await request(app)
        .post(`${defaultPath}/login`)
        .send({ email: 'any_email@mail.com' })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ message: 'Missing param: password', error: 'MissingParamError' })
    })

    test('Should return an 400 if email not exists', async () => {
      const response = await request(app)
        .post(`${defaultPath}/login`)
        .send({ email: 'any_not_exists_email@mail.com', password: '123456789' })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ message: 'Email or password are incorrects', error: 'LoginUserError' })
    })

    test('Should return an 400 if password not match', async () => {
      const response = await request(app)
        .post(`${defaultPath}/login`)
        .send({ email: 'any_email@mail.com', password: '123' })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ message: 'Email or password are incorrects', error: 'LoginUserError' })
    })

    test('Should return an 400 if User is not active', async () => {
      await userCollection.findOneAndUpdate({ _id: new ObjectId(insertedId) }, { $set: { isActive: false } })

      const response = await request(app)
        .post(`${defaultPath}/login`)
        .send({ email: 'any_email@mail.com', password: '123456789' })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ message: 'User is not active yet', error: 'LoginUserError' })
    })
  })
})
