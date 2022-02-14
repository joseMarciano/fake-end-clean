import { Collection } from 'mongodb'
import { UserModel } from '../../domain/usecases/user/add/AddUser'
import { MongoHelper } from '../db/mongo/mongoHelper'
import { UserMongoRespository } from './UserMongoRepository'

const makeFakeUserModel = (): UserModel => ({
  email: 'any_email@mail.com',
  name: 'any_name',
  password: 'any_password',
  isActive: false
})
interface SutTypes {
  sut: UserMongoRespository
}

const makeSut = (): SutTypes => {
  const sut = new UserMongoRespository()

  return {
    sut
  }
}

describe('UserMongoRepository', () => {
  let userCollection: Collection
  let userAccessTokenCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    userCollection = await MongoHelper.getCollection('users')
    userAccessTokenCollection = await MongoHelper.getCollection('usersAccessToken')
    await userCollection.deleteMany({})
    await userAccessTokenCollection.deleteMany({})
  })

  describe('INTERFACE AddUserRepository', () => {
    test('Should return an User on add success', async () => {
      const { sut } = makeSut()

      const user = await sut.add(makeFakeUserModel())

      expect(user).toBeTruthy()
      expect(user.id).toBeTruthy()
      expect(user.name).toBe('any_name')
      expect(user.password).toBe('any_password')
    })
  })
  describe('INTERFACE FindUserByEmailRepository', () => {
    test('Should return an User on findByEmail success', async () => {
      const { sut } = makeSut()

      await userCollection.insertOne(makeFakeUserModel())

      const user = await sut.findByEmail('any_email@mail.com')

      expect(user).toBeTruthy()
      expect(user.id).toBeTruthy()
      expect(user.name).toBe('any_name')
      expect(user.password).toBe('any_password')
      expect(user.email).toBe('any_email@mail.com')
    })
    test('Should return an null on findByEmail fails', async () => {
      const { sut } = makeSut()
      const user = await sut.findByEmail('any_email@mail.com')
      expect(user).toBe(null)
    })
  })

  describe('INTERFACE UpdateUserAccessTokenRepository', () => {
    test('Should updateUserAccessToken on UpdateUserAccessTokenRepository succeeds', async () => {
      const { sut } = makeSut()

      const result = await userCollection.insertOne(makeFakeUserModel())

      await sut.updateAccessToken({
        accessToken: 'any_token',
        userId: result.insertedId.toString(),
        createdAt: new Date()
      })

      const mongoUserAccessToken =
      await userAccessTokenCollection.findOne({ userId: result.insertedId.toString() }) as any

      expect(mongoUserAccessToken.userId).toBe(result.insertedId.toString())
      expect(mongoUserAccessToken.accessToken).toBe('any_token')
    })
  })

  describe('INTERFACE ActiveUserByIdRepository', () => {
    test('Should active user on success', async () => {
      const { sut } = makeSut()

      await userCollection.insertOne(makeFakeUserModel())

      const user = await userCollection.findOne({}) as any

      expect(user.isActive).toBe(false)

      await sut.activeById(user._id.toString())

      const userUpdated = await userCollection.findOne({}) as any

      expect(userUpdated._id).toEqual(user._id)
      expect(userUpdated.isActive).toBe(true)
    })
    test('Should return an user on active success', async () => {
      const { sut } = makeSut()

      await userCollection.insertOne(makeFakeUserModel())

      const user = await userCollection.findOne({}) as any

      expect(user.isActive).toBe(false)

      const userUpdated = await sut.activeById(user._id.toString())

      expect(userUpdated.id).toEqual(user._id.toString())
      expect(userUpdated.isActive).toBe(true)
    })
  })
})
