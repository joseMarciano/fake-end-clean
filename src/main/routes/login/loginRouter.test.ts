import { app } from '../../config/app'
import request from 'supertest'
import { MongoHelper } from '../../../infra/db/mongo/mongoHelper'
import { JwtAdapter } from '../../../infra/cryptography/jwt/JwtAdapter'
import { Collection, ObjectId } from 'mongodb'
import jwt, { sign } from 'jsonwebtoken'
import { validate } from 'uuid'

let userCollection: Collection
let userAccessCollection: Collection
let userRefreshCollection: Collection
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
  userRefreshCollection = await MongoHelper.getCollection('usersRefreshToken')
  await userCollection.deleteMany({})
  await userAccessCollection.deleteMany({})
  await userRefreshCollection.deleteMany({})
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

    test('Should return an 400 if no email is provided', async () => {
      const response = await request(app)
        .post(`${defaultPath}/signup`)
        .send({
          name: 'marcianojosepaulo',
          password: '123',
          passwordConfirmation: '123'
        })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ message: 'Missing param: email', error: 'MissingParamError' })
    })

    test('Should return an 400 if no password is provided', async () => {
      const response = await request(app)
        .post(`${defaultPath}/signup`)
        .send({
          email: 'marcianojosepaulo@email.com',
          name: 'marcianojosepaulo'
        })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ message: 'Missing param: password', error: 'MissingParamError' })
    })

    test('Should return an 400 if no passwordConfirmation is provided', async () => {
      const response = await request(app)
        .post(`${defaultPath}/signup`)
        .send({
          email: 'marcianojosepaulo@email.com',
          name: 'marcianojosepaulo',
          password: '123'
        })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ message: 'Missing param: passwordConfirmation', error: 'MissingParamError' })
    })

    test('Should return an 400 if no password not match with passwordConfirmation', async () => {
      const response = await request(app)
        .post(`${defaultPath}/signup`)
        .send({
          email: 'marcianojosepaulo@email.com',
          name: 'marcianojosepaulo',
          password: '123',
          passwordConfirmation: '456'
        })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ message: 'Invalid param: passwordConfirmation', error: 'InvalidParamError' })
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

    test('Should return an 400 if user param is not provided', async () => {
      const userId = await insertFakeUser()
      const accessToken = await makeFakeUserParam()
      await insertFakeUserAccessToken(userId, accessToken)

      const response = await request(app)
        .get(`${defaultPath}/active`)
        .send()

      expect(response.status).toBe(400)
    })

    test('Should return an 403 if user param is invalid', async () => {
      await insertFakeUser()
      const accessToken = await makeFakeUserParam()

      const response = await request(app)
        .get(`${defaultPath}/active`)
        .query({ user: accessToken })
        .send()

      expect(response.status).toBe(403)
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

  describe('POST /logout', () => {
    let insertedId: string
    let authorization: string

    const createContextAuthentication = async (): Promise<any> => {
      const result = await userCollection.insertOne({ email: 'any_email@mail.com', name: 'any_name', password: '123', isActive: true })
      const token = sign({ id: result.insertedId.toString(), email: 'any_email@mail.com', name: 'any_name' }, process.env.JWT_SECRET_KEY as string)
      await userAccessCollection.insertOne({ userId: result.insertedId.toString(), accessToken: token })
      await userRefreshCollection.insertOne({ userId: result.insertedId.toString(), refreshToken: 'any_token' })
      authorization = token

      return {
        userIdContext: result.insertedId.toString()
      }
    }

    beforeEach(async () => {
      await clearCollections()
      insertedId = (await createContextAuthentication()).userIdContext
    })

    test('Should return an 204 if logout succeeds', async () => {
      const response = await request(app)
        .post(`${defaultPath}/auth/logout`)
        .set('Authorization', authorization)

      expect(response.status).toBe(204)
    })

    test('Should delete all userAccessTokens by userId', async () => {
      const response = await request(app)
        .post(`${defaultPath}/auth/logout`)
        .set('Authorization', authorization)

      expect(response.status).toBe(204)
      expect(await userAccessCollection.findOne({ userId: insertedId })).toBeNull()
    })

    test('Should delete all userRefreshTokens by userId', async () => {
      const response = await request(app)
        .post(`${defaultPath}/auth/logout`)
        .set('Authorization', authorization)

      expect(response.status).toBe(204)
      expect(await userRefreshCollection.findOne({ userId: insertedId })).toBeNull()
    })
  })

  describe('POST /access-token', () => {
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

    const insertFakeRefreshToken = async (): Promise<void> => {
      await userRefreshCollection.insertOne({ refreshToken: 'any_refreshToken', userId: insertedId })
    }

    const createRefreshTokenBody = (): any => ({
      refreshToken: 'any_refreshToken'
    })

    beforeEach(async () => {
      await clearCollections()
      insertedId = await insertFakeUser()
      await insertFakeRefreshToken()
    })

    test('Should return an 200 on updateAccessToken success', async () => {
      const response = await request(app)
        .post(`${defaultPath}/access-token`)
        .send(createRefreshTokenBody())

      expect(response.status).toBe(200)
      expect(response.body?.accessToken).toBeTruthy()
    })

    test('Should return an 401 if refresh token is not provided', async () => {
      const response = await request(app)
        .post(`${defaultPath}/access-token`)
        .send()

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Refreshtoken was not provided',
        error: 'UpdateAccessTokenError'
      })
    })

    test('Should return an 401 if refresh token is expired', async () => {
      await userRefreshCollection.deleteMany({})
      const response = await request(app)
        .post(`${defaultPath}/access-token`)
        .send(createRefreshTokenBody())

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Refreshtoken expired',
        error: 'UpdateAccessTokenError'
      })
    })

    test('Should return an 401 if user not exists', async () => {
      await userCollection.deleteMany({})
      const response = await request(app)
        .post(`${defaultPath}/access-token`)
        .send(createRefreshTokenBody())

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Error on update accessToken',
        error: 'UpdateAccessTokenError'
      })
    })

    // test('Should return an accessToken if password not match', async () => {
    //   const response = await request(app)
    //     .post(`${defaultPath}/login`)
    //     .send(createLoginBody())

    //   expect(response.status).toBe(200)
    //   expect(jwt.verify(response.body.accessToken, process.env.JWT_SECRET_KEY as string)).toBeTruthy()
    //   expect(validate(response.body.refreshToken)).toBeTruthy()
    // })

    // test('Should return an 400 if no email is provided', async () => {
    //   const response = await request(app)
    //     .post(`${defaultPath}/login`)
    //     .send({ password: '123456789' })

    //   expect(response.status).toBe(400)
    //   expect(response.body).toEqual({ message: 'Missing param: email', error: 'MissingParamError' })
    // })

    // test('Should return an 400 if no password is provided', async () => {
    //   const response = await request(app)
    //     .post(`${defaultPath}/login`)
    //     .send({ email: 'any_email@mail.com' })

    //   expect(response.status).toBe(400)
    //   expect(response.body).toEqual({ message: 'Missing param: password', error: 'MissingParamError' })
    // })

    // test('Should return an 400 if email not exists', async () => {
    //   const response = await request(app)
    //     .post(`${defaultPath}/login`)
    //     .send({ email: 'any_not_exists_email@mail.com', password: '123456789' })

    //   expect(response.status).toBe(400)
    //   expect(response.body).toEqual({ message: 'Email or password are incorrects', error: 'LoginUserError' })
    // })

    // test('Should return an 400 if password not match', async () => {
    //   const response = await request(app)
    //     .post(`${defaultPath}/login`)
    //     .send({ email: 'any_email@mail.com', password: '123' })

    //   expect(response.status).toBe(400)
    //   expect(response.body).toEqual({ message: 'Email or password are incorrects', error: 'LoginUserError' })
    // })

    // test('Should return an 400 if User is not active', async () => {
    //   await userCollection.findOneAndUpdate({ _id: new ObjectId(insertedId) }, { $set: { isActive: false } })

    //   const response = await request(app)
    //     .post(`${defaultPath}/login`)
    //     .send({ email: 'any_email@mail.com', password: '123456789' })

    //   expect(response.status).toBe(400)
    //   expect(response.body).toEqual({ message: 'User is not active yet', error: 'LoginUserError' })
    // })
  })
})
