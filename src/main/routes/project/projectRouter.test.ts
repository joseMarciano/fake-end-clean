import request from 'supertest'
import { app } from '../../../main/config/app'
import { MongoHelper } from '../../../infra/db/mongo/mongoHelper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'

const defaultPath = `${process.env.DEFAULT_PATH as string}/auth/project`

let userCollection: Collection
let userAccessCollection: Collection
let authorization: string
let userId: string

const createContextAuthentication = async (): Promise<void> => {
  const result = await userCollection.insertOne({ email: 'any_email@mail.com', name: 'any_name', password: '123', isActive: true })
  const token = sign({ email: 'any_email@mail.com', name: 'any_name' }, process.env.JWT_SECRET_KEY as string)
  await userAccessCollection.insertOne({ userId: result.insertedId.toString(), accessToken: token })
  authorization = token
  userId = result.insertedId.toString()
}

const clearCollections = async (): Promise<void> => {
  await userCollection.deleteMany({})
  await userAccessCollection.deleteMany({})
}

describe('projectRoute', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
    userCollection = await MongoHelper.getCollection('users')
    userAccessCollection = await MongoHelper.getCollection('usersAccessToken')
  })

  beforeEach(async () => {
    await clearCollections()
    await createContextAuthentication()
  })

  afterEach(async () => {
    await clearCollections()
    authorization = ''
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  // TODO CRRIAR DEMAIS TESTES DE INTEGRAÇÃO
  describe('/project POST', () => {
    test('Should return 200 on Project is added', async () => {
      const response = await request(app)
        .post(defaultPath)
        .send({ title: 'Project', description: 'Project to use' })
        .query({ userId })
        .set('Authorization', authorization)

      console.log(response.body)
      expect(response.status).toBe(200)
      expect(response.body?.id).toBeTruthy()
    })
  })
})
