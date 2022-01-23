import { MongoHelper } from './mongoHelper'

const MONGO_URL = 'mongodb://localhost:27017/fake-end'

describe('mongoHelper', () => {
  test('Should connect when connect is called', async () => {
    let client = MongoHelper.client
    expect(client).toBeFalsy()

    await MongoHelper.connect(MONGO_URL)

    client = MongoHelper.client
    expect(client).toBeTruthy()
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
  })
})
