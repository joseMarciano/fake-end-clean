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
  let userRefreshTokenCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    userCollection = await MongoHelper.getCollection('users')
    userAccessTokenCollection = await MongoHelper.getCollection('usersAccessToken')
    userRefreshTokenCollection = await MongoHelper.getCollection('usersRefreshToken')
    await userCollection.deleteMany({})
    await userAccessTokenCollection.deleteMany({})
    await userRefreshTokenCollection.deleteMany({})
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

  describe('INTERFACE AddUserRefreshTokenRepository', () => {
    test('Should updateUserAccessToken on AddUserRefreshTokenRepository succeeds', async () => {
      const { sut } = makeSut()

      const result = await userCollection.insertOne(makeFakeUserModel())

      await sut.addRefreshToken({
        refreshToken: 'any_token',
        userId: result.insertedId.toString()
      })

      const mongoUserAccessToken =
      await userRefreshTokenCollection.findOne({ userId: result.insertedId.toString() }) as any

      expect(mongoUserAccessToken.userId).toBe(result.insertedId.toString())
      expect(mongoUserAccessToken.refreshToken).toBe('any_token')
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

  describe('INTERFACE AddUserAccessRepository', () => {
    test('Should add a userAccessToken in on success', async () => {
      const { sut } = makeSut()

      await sut.addUserAccess({
        accessToken: 'any_access_token',
        userId: 'any_id'
      })

      const userAccessToken = await userAccessTokenCollection.findOne() as any

      expect(userAccessToken.accessToken).toBe('any_access_token')
      expect(userAccessToken.userId).toBe('any_id')
    })
  })

  describe('INTERFACE DeleteUserAccessTokensByUserIdRepository', () => {
    test('Should add a delete all userAccessTokens by userId on success', async () => {
      const { sut } = makeSut()
      await userAccessTokenCollection.insertOne({ userId: 'any_id' })
      await sut.deleteAccessTokensByUserId('any_id')
      const userAccessToken = await userAccessTokenCollection.findOne() as any
      expect(userAccessToken).toBeNull()
    })
  })

  describe('INTERFACE DeleteUserRefreshTokensByUserIdRepository', () => {
    test('Should add a delete all userRefreshTokens by userId on success', async () => {
      const { sut } = makeSut()
      await userRefreshTokenCollection.insertOne({ userId: 'any_id' })
      await sut.deleteRefreshTokensByUserId('any_id')
      const userAccessToken = await userRefreshTokenCollection.findOne() as any
      expect(userAccessToken).toBeNull()
    })
  })

  describe('INTERFACE FindUserAccessRepository', () => {
    test('Should findUserAccess on success', async () => {
      await userAccessTokenCollection.insertOne({
        accessToken: 'any_access_token',
        userId: 'any_id',
        createdAt: new Date()
      })

      const { sut } = makeSut()

      await sut.findUserAccess(
        'any_id',
        'any_access_token'
      )

      const userAccessToken = await userAccessTokenCollection.findOne() as any

      expect(userAccessToken.accessToken).toBe('any_access_token')
      expect(userAccessToken.userId).toBe('any_id')
    })

    test('Should return null on findUserAccess fails', async () => {
      const { sut } = makeSut()

      await sut.findUserAccess(
        'any_id',
        'any_access_token'
      )

      const userAccessToken = await userAccessTokenCollection.findOne() as any

      expect(userAccessToken).toBeNull()
    })
  })
  describe('INTERFACE FindUserByIdRepository', () => {
    test('Should findUserById on success', async () => {
      const result = await userCollection.insertOne(makeFakeUserModel())
      const { sut } = makeSut()

      const user = await sut.findById(result.insertedId.toString())

      expect(user.id).toBe(result.insertedId.toString())
    })

    test('Should return null on findById fails', async () => {
      const result = await userCollection.insertOne(makeFakeUserModel())
      await userCollection.deleteMany({})

      const { sut } = makeSut()
      const user = await sut.findById(result.insertedId.toString())

      expect(user).toBeNull()
    })
  })
})
