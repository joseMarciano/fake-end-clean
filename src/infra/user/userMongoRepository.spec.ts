import { Collection } from 'mongodb'
import { UserModel } from '../../domain/usecases/user/AddUser'
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
})
