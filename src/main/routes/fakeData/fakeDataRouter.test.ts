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

let resultUserInsert: any
let resultProjectInsert: any
let resultResourceInsert: any

const createContextAuthentication = async (): Promise<void> => {
  resultUserInsert = await userCollection.insertOne({ email: 'any_email@mail.com', name: 'any_name', password: '123', isActive: true })
  resultProjectInsert = await projectCollection.insertOne({ user: resultUserInsert.insertedId.toString() })
  resultResourceInsert = await resourceCollection.insertOne({ name: 'managers', user: resultUserInsert.insertedId.toString(), project: resultProjectInsert.insertedId.toString() })

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

  describe('/^.+\/edit$/ PUT', () => {
    beforeEach(async () => {
      await clearCollections()
      await createContextAuthentication()
    })

    afterEach(async () => {
      await clearCollections()
      authorization = ''
    })

    test('Should return 200 on FakeData is edited', async () => {
      const resultFakeData = await fakeDataCollection.insertOne(
        {
          project: resultProjectInsert.insertedId.toString(),
          resource: resultResourceInsert.insertedId.toString(),
          content: {
            field: 123,
            otherField: 'name'
          }
        })

      const response = await request(app)
        .put(`${defaultPath}/edit`)
        .send({ id: resultFakeData.insertedId.toString(), field: 'edited', otherField: 'edited_other' })
        .set('Authorization', authorization)

      expect(response.status).toBe(200)
      expect(response.body?.id).toBeTruthy()
      expect(response.body?.field).toBe('edited')
      expect(response.body?.otherField).toBe('edited_other')
    })

    test('Should return no body if EditFakeDate fails', async () => {
      const resultFakeData = await fakeDataCollection.insertOne({})
      await fakeDataCollection.deleteMany({})

      const response = await request(app)
        .put(`${defaultPath}/edit`)
        .send({ id: resultFakeData.insertedId.toString(), field: 'edited', otherField: 'edited_other' })
        .set('Authorization', authorization)

      expect(response.status).toBe(200)
      expect(response.body).toEqual({})
    })
  })

  describe('/^.+\/list-all$/ GET', () => {
    beforeEach(async () => {
      await clearCollections()
      await createContextAuthentication()
    })

    afterEach(async () => {
      await clearCollections()
      authorization = ''
    })

    test('Should return 200 on FakeData is found', async () => {
      const result = await fakeDataCollection.insertOne(
        {
          project: resultProjectInsert.insertedId.toString(),
          resource: resultResourceInsert.insertedId.toString(),
          content: {
            field: 123,
            otherField: 'name'
          }
        })

      const response = await request(app)
        .get(`${defaultPath}/list-all`)
        .set('Authorization', authorization)

      expect(response.status).toBe(200)
      expect(response.body.length > 0).toBe(true)
      expect(response.body[0]).toEqual({
        id: result.insertedId.toString(),
        field: 123,
        otherField: 'name'
      })
    })

    test('Should return empty array on FakeData is not found', async () => {
      const response = await request(app)
        .get(`${defaultPath}/list-all`)
        .set('Authorization', authorization)

      expect(response.status).toBe(200)
      expect(response.body.length > 0).toBe(false)
    })
  })

  describe('/^.+\/page$/ GET', () => {
    const fakeDataIds = [] as any
    beforeEach(async () => {
      await clearCollections()
      await createContextAuthentication()

      for (let index = 0; index < 30; index++) {
        fakeDataIds.push((await fakeDataCollection.insertOne(
          {
            project: resultProjectInsert.insertedId.toString(),
            resource: resultResourceInsert.insertedId.toString(),
            content: {
              field: 123,
              otherField: 'name'
            }
          })).insertedId.toString())
      }
    })

    afterEach(async () => {
      await clearCollections()
      authorization = ''
    })

    test('Should return 200 on has project', async () => {
      const response = await request(app)
        .get(`${defaultPath}/page`)
        .set('Authorization', authorization)

      expect(response.status).toBe(200)
      expect(response.body?.offset).toBe(0)
      expect(response.body?.limit).toBe(20)
      expect(response.body?.hasNext).toBe(true)

      response.body?.content.forEach((fakeData: any) => {
        fakeDataIds.includes(fakeData.id)
      })
    })

    test('Should return empty content if has no FakeData', async () => {
      await fakeDataCollection.deleteMany({})
      const response = await request(app)
        .get(`${defaultPath}/page`)
        .set('Authorization', authorization)
        .query({ offset: 10, limit: 10 })

      expect(response.status).toBe(200)
      expect(response.body?.offset).toBe(10)
      expect(response.body?.limit).toBe(10)
      expect(response.body?.hasNext).toBe(false)
      expect(response.body?.content).toEqual([])
    })

    // test('Should return 200 on FakeData is found', async () => {
    //   const result = await fakeDataCollection.insertOne(
    //     {
    //       project: resultProjectInsert.insertedId.toString(),
    //       resource: resultResourceInsert.insertedId.toString(),
    //       content: {
    //         field: 123,
    //         otherField: 'name'
    //       }
    //     })

    //   const response = await request(app)
    //     .get(`${defaultPath}/list-all`)
    //     .set('Authorization', authorization)

    //   expect(response.status).toBe(200)
    //   expect(response.body.length > 0).toBe(true)
    //   expect(response.body[0]).toEqual({
    //     id: result.insertedId.toString(),
    //     field: 123,
    //     otherField: 'name'
    //   })
    // })

    // test('Should return empty array on FakeData is not found', async () => {
    //   const response = await request(app)
    //     .get(`${defaultPath}/list-all`)
    //     .set('Authorization', authorization)

    //   expect(response.status).toBe(200)
    //   expect(response.body.length > 0).toBe(false)
    // })
  })
})
