import { CollectionInfo, Db } from 'mongodb'
import { MongoHelper } from './mongoHelper'

const MONGO_URL = process.env.MONGO_URL as string

const getCollectionByName = async (db: Db, collectionName: string): Promise<CollectionInfo | undefined> => {
  const listCollections = db.listCollections()
  const array = await listCollections.toArray()
  return array.find((collection: CollectionInfo) => collection.name === collectionName)
}

describe('mongoHelper', () => {
  beforeEach(async () => {
    await MongoHelper.connect(MONGO_URL)
    await MongoHelper.client.db().dropDatabase()
    await MongoHelper.disconnect()
  })

  test('Should connect when connect is called', async () => {
    let client = MongoHelper.client
    expect(client).toBeFalsy()

    await MongoHelper.connect(MONGO_URL)

    client = MongoHelper.client
    expect(client).toBeTruthy()
    await MongoHelper.disconnect()
  })
  test('Should disconnect when disconnect is called', async () => {
    await MongoHelper.connect(MONGO_URL)

    let client = MongoHelper.client
    expect(client).toBeTruthy()

    await MongoHelper.disconnect()

    client = MongoHelper.client
    expect(client).toBeFalsy()
  })
  test('Should recconect when mongo connection is down', async () => {
    await MongoHelper.connect(MONGO_URL)

    let collection = await MongoHelper.getCollection('any')
    expect(collection).toBeTruthy()

    await MongoHelper.disconnect()

    collection = await MongoHelper.getCollection('any')
    expect(collection).toBeTruthy()

    await MongoHelper.disconnect()
  })
  test('Should create usersRefreshToken collection', async () => {
    await MongoHelper.connect(MONGO_URL)
    const db = MongoHelper.client.db()

    await MongoHelper.createCustomCollections()
    const usersRefreshTokenCollectionInfo = await getCollectionByName(db, 'usersRefreshToken')

    expect(usersRefreshTokenCollectionInfo).toBeTruthy()

    await MongoHelper.disconnect()
  })
  test('Should create usersAccessTokenCollection collection', async () => {
    await MongoHelper.connect(MONGO_URL)
    const db = MongoHelper.client.db()

    await MongoHelper.createCustomCollections()
    const usersAccessTokenCollectionInfo = await getCollectionByName(db, 'usersAccessToken')

    expect(usersAccessTokenCollectionInfo).toBeTruthy()

    await MongoHelper.disconnect()
  })
})
