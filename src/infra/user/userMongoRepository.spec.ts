import { UserModel } from '../../domain/usecases/AddUser'
import { MongoHelper } from '../db/mongo/mongoHelper'
import { UserMongoRespository } from './UserMongoRepository'

const makeFakeUserModel = (): UserModel => ({
  email: 'any_email@mail.com',
  name: 'any_name',
  password: 'any_password'
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
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const userCollection = await MongoHelper.getCollection('users')
    await userCollection.deleteMany({})
  })

  test('Should return an User on add success', async () => {
    const { sut } = makeSut()

    const user = await sut.add(makeFakeUserModel())

    expect(user).toBeTruthy()
    expect(user.id).toBeTruthy()
    expect(user.name).toBe('any_name')
    expect(user.password).toBe('any_password')
  })
})
