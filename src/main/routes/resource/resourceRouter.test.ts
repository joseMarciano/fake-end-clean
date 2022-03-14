import request from 'supertest'
import { sign } from 'jsonwebtoken'
import { Collection, ObjectId } from 'mongodb'
import { app } from '../../config/app'
import { MongoHelper } from '../../../infra/db/mongo/mongoHelper'

const defaultPath = `${process.env.DEFAULT_PATH as string}/auth/resource`

let userCollection: Collection
let userAccessCollection: Collection
let projectCollection: Collection
let resourceCollection: Collection
let authorization: string
let userContextId: string

const createContextAuthentication = async (): Promise<any> => {
  const result = await userCollection.insertOne({ email: 'any_email@mail.com', name: 'any_name', password: '123', isActive: true })
  const token = sign({ email: 'any_email@mail.com', name: 'any_name' }, process.env.JWT_SECRET_KEY as string)
  await userAccessCollection.insertOne({ userId: result.insertedId.toString(), accessToken: token })
  authorization = token
  userContextId = result.insertedId.toString()

  return {
    userIdContext: result.insertedId.toString()
  }
}

const clearCollections = async (): Promise<void> => {
  await userCollection.deleteMany({})
  await userAccessCollection.deleteMany({})
  await resourceCollection.deleteMany({})
}

describe('resourceRoute', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
    userCollection = await MongoHelper.getCollection('users')
    userAccessCollection = await MongoHelper.getCollection('usersAccessToken')
    resourceCollection = await MongoHelper.getCollection('resources')
    projectCollection = await MongoHelper.getCollection('projects')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('/resource/:projectId POST', () => {
    let projectId = ''
    beforeEach(async () => {
      await clearCollections()
      await createContextAuthentication()
      projectId = (await projectCollection.insertOne({ user: userContextId })).insertedId.toString()
    })

    afterEach(async () => {
      await clearCollections()
      authorization = ''
    })

    test('Should return 200 on Resource is added', async () => {
      const response = await request(app)
        .post(`${defaultPath}/${projectId}`)
        .send({ name: 'Resource' })
        .set('Authorization', authorization)

      expect(response.status).toBe(200)
      expect(response.body?.id).toBeTruthy()
    })

    test('Should return 400 if no Project is found', async () => {
      await projectCollection.deleteMany({})

      const response = await request(app)
        .post(`${defaultPath}/${projectId}`)
        .send({ name: 'Resource' })
        .set('Authorization', authorization)

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ message: 'Project not found', error: 'AddResourceError' })
    })

    test('Should return 400 if no Resource name already exists', async () => {
      await resourceCollection.insertOne({ user: userContextId, project: projectId, name: 'Resource' })

      const response = await request(app)
        .post(`${defaultPath}/${projectId}`)
        .send({ name: 'Resource' })
        .set('Authorization', authorization)

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ message: 'Resource name already exists', error: 'AddResourceError' })
    })
  })

  describe('/resource/:projectId GET', () => {
    let projectId = ''
    beforeEach(async () => {
      await clearCollections()
      await createContextAuthentication()
      projectId = (await projectCollection.insertOne({ user: userContextId })).insertedId.toString()
    })

    afterEach(async () => {
      await clearCollections()
      authorization = ''
    })

    test('Should return 200 on Resource is found', async () => {
      await resourceCollection.insertOne({ user: userContextId, project: projectId, name: 'Resource' })

      const response = await request(app)
        .get(`${defaultPath}/${projectId}`)
        .set('Authorization', authorization)

      expect(response.status).toBe(200)
      expect(response.body.length > 0).toBe(true)
    })

    test('Should return empty array if no Resource is found', async () => {
      const response = await request(app)
        .post(`${defaultPath}/${projectId}`)
        .send({ name: 'Resource' })
        .set('Authorization', authorization)

      expect(response.status).toBe(200)
      expect(response.body.length > 0).toBe(false)
    })
  })

  describe('/resource/:id DELETE', () => {
    let projectId = ''
    let resourceId = ''
    beforeEach(async () => {
      await clearCollections()
      await createContextAuthentication()
      projectId = (await projectCollection.insertOne({ user: userContextId })).insertedId.toString()
      resourceId = (await resourceCollection.insertOne({ user: userContextId, project: projectId, name: 'Resource' })).insertedId.toString()
    })

    afterEach(async () => {
      await clearCollections()
      authorization = ''
    })

    test('Should return 204 on Resource is deleted', async () => {
      const response = await request(app)
        .delete(`${defaultPath}/${resourceId}`)
        .set('Authorization', authorization)

      expect(response.status).toBe(204)
    })

    test('Should delete Resource if success', async () => {
      let collection = await resourceCollection.findOne({ _id: new ObjectId(resourceId) })

      expect(collection).toBeTruthy()

      await request(app)
        .delete(`${defaultPath}/${resourceId}`)
        .set('Authorization', authorization)

      collection = await resourceCollection.findOne({ _id: new ObjectId(resourceId) })

      expect(collection).toBeFalsy()
    })
  })
})
