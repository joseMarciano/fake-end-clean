/* eslint-disable no-useless-escape */
import request from 'supertest'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import { app } from '../../config/app'
import { MongoHelper } from '../../../infra/db/mongo/mongoHelper'

const defaultPath = `${process.env.DEFAULT_PATH as string}/fake/managers`

let userCollection: Collection
let userAccessCollection: Collection
let projectCollection: Collection
let fakeDataCollection: Collection
let resourceCollection: Collection
let authorization: string

const createContextAuthentication = async (): Promise<void> => {
  const resultUserInsert = await userCollection.insertOne({ email: 'any_email@mail.com', name: 'any_name', password: '123', isActive: true })
  const resultProjectInsert = await projectCollection.insertOne({ user: resultUserInsert.insertedId.toString() })
  await resourceCollection.insertOne({ name: 'managers', user: resultUserInsert.insertedId.toString(), project: resultProjectInsert.insertedId.toString() })

  const token = sign(resultProjectInsert.insertedId.toString(), process.env.JWT_SECRET_KEY as string)
  authorization = token
}

const clearCollections = async (): Promise<void> => {
  await userCollection.deleteMany({})
  await userAccessCollection.deleteMany({})
  await projectCollection.deleteMany({})
  await fakeDataCollection.deleteMany({})
}

describe('projectRoute', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
    userCollection = await MongoHelper.getCollection('users')
    userAccessCollection = await MongoHelper.getCollection('usersAccessToken')
    projectCollection = await MongoHelper.getCollection('projects')
    fakeDataCollection = await MongoHelper.getCollection('fakeDatas')
    resourceCollection = await MongoHelper.getCollection('resources')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await clearCollections()
    await createContextAuthentication()
  })

  afterEach(async () => {
    await clearCollections()
    authorization = ''
  })

  test('Should return 400 if wrong resource is provided', async () => {
    const response = await request(app)
      .post(`${defaultPath}213`)
      .send({ description: 'Project to ue' })
      .set('Authorization', authorization)

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: 'Resource not found', statusCode: 400 })
  })

  test('Should return 403 if no authorization header is provided', async () => {
    const response = await request(app)
      .post(`${defaultPath}213`)
      .send({ description: 'Project to ue' })

    expect(response.status).toBe(403)
    expect(response.body).toEqual({ statusCode: 403 })
  })

  describe('/^.+\/create$/ POST', () => {
    beforeEach(async () => {
      await clearCollections()
      await createContextAuthentication()
    })

    afterEach(async () => {
      await clearCollections()
      authorization = ''
    })

    test('Should return 200 on FakeData is added', async () => {
      const response = await request(app)
        .post(`${defaultPath}/create`)
        .send({ title: 'Project', description: 'Project to use' })
        .set('Authorization', authorization)

      expect(response.status).toBe(200)
      expect(response.body?.id).toBeTruthy()
      expect(response.body?.title).toBe('Project')
      expect(response.body?.description).toBe('Project to use')
    })
  })
})
