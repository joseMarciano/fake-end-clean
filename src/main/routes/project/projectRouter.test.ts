import request from 'supertest'
import { app } from '../../../main/config/app'
import { MongoHelper } from '../../../infra/db/mongo/mongoHelper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'

const defaultPath = `${process.env.DEFAULT_PATH as string}/auth/project`

let userCollection: Collection
let userAccessCollection: Collection
let projectCollection: Collection
let authorization: string

const createContextAuthentication = async (): Promise<any> => {
  const result = await userCollection.insertOne({ email: 'any_email@mail.com', name: 'any_name', password: '123', isActive: true })
  const token = sign({ email: 'any_email@mail.com', name: 'any_name' }, process.env.JWT_SECRET_KEY as string)
  await userAccessCollection.insertOne({ userId: result.insertedId.toString(), accessToken: token })
  authorization = token

  return {
    userIdContext: result.insertedId.toString()
  }
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
    projectCollection = await MongoHelper.getCollection('projects')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('/project POST', () => {
    beforeEach(async () => {
      await clearCollections()
      await createContextAuthentication()
    })

    afterEach(async () => {
      await clearCollections()
      authorization = ''
    })

    test('Should return 200 on Project is added', async () => {
      const response = await request(app)
        .post(defaultPath)
        .send({ title: 'Project', description: 'Project to use' })
        .set('Authorization', authorization)

      expect(response.status).toBe(200)
      expect(response.body?.id).toBeTruthy()
    })

    test('Should return 400 if no title is provided', async () => {
      const response = await request(app)
        .post(defaultPath)
        .send({ description: 'Project to use' })
        .set('Authorization', authorization)

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ message: 'Missing param: title', error: 'MissingParamError' })
    })

    test('Should return 400 if no description is provided', async () => {
      const response = await request(app)
        .post(defaultPath)
        .send({ title: 'Project' })
        .set('Authorization', authorization)

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ message: 'Missing param: description', error: 'MissingParamError' })
    })
  })
  describe('/project/:id GET', () => {
    let projectId = ''

    beforeEach(async () => {
      await clearCollections()
      const result = await createContextAuthentication()
      projectId = (await projectCollection.insertOne({ user: result.userIdContext })).insertedId.toString()
    })

    afterEach(async () => {
      await clearCollections()
      authorization = ''
    })

    test('Should return 200 on Project is find', async () => {
      const response = await request(app)
        .get(`${defaultPath}/${projectId}`)
        .set('Authorization', authorization)

      expect(response.status).toBe(200)
      expect(response.body?.id).toBe(projectId)
    })
  })
  describe('/project/ GET', () => {
    const projectsIds: string[] = []
    beforeEach(async () => {
      await clearCollections()
      const result = await createContextAuthentication()
      for (let index = 0; index < 50; index++) {
        projectsIds.push(await (await projectCollection.insertOne({ user: result.userIdContext })).insertedId.toString())
      }
    })

    afterEach(async () => {
      await clearCollections()
      authorization = ''
    })

    test('Should return 200 on has project', async () => {
      const response = await request(app)
        .get(defaultPath)
        .set('Authorization', authorization)

      expect(response.status).toBe(200)
      expect(response.body?.offset).toBe(0)
      expect(response.body?.limit).toBe(20)
      expect(response.body?.hasNext).toBe(true)

      response.body?.content.forEach((project: any) => {
        projectsIds.includes(project.id)
      })
    })

    test('Should return empty content if has no Project', async () => {
      await projectCollection.deleteMany({})
      const response = await request(app)
        .get(defaultPath)
        .set('Authorization', authorization)
        .query({ offset: 10, limit: 10 })

      expect(response.status).toBe(200)
      expect(response.body?.offset).toBe(10)
      expect(response.body?.limit).toBe(10)
      expect(response.body?.hasNext).toBe(false)
      expect(response.body?.content).toEqual([])
    })
  })

  describe('/project/:id DELETE', () => {
    let projectId = ''

    beforeEach(async () => {
      await clearCollections()
      const result = await createContextAuthentication()
      projectId = (await projectCollection.insertOne({ user: result.userIdContext })).insertedId.toString()
    })

    afterEach(async () => {
      await clearCollections()
      authorization = ''
    })

    test('Should return 200 on Project is deleted', async () => {
      const response = await request(app)
        .delete(`${defaultPath}/${projectId}`)
        .set('Authorization', authorization)
      const result = await projectCollection.findOne({})
      expect(response.status).toBe(204)
      expect(result).toBeNull()
    })
  })
})
