import { MongoHelper } from './mongoHelper'

const MONGO_URL = 'mongodb://localhost:27017/fake-end'

describe('mongoHelper', () => {
  test('Should connect when connect is called', async () => {
    let collection = MongoHelper.getCollection('any')
    expect(collection).toBeFalsy()

    await MongoHelper.connect(MONGO_URL)

    collection = MongoHelper.getCollection('any')
    expect(collection).toBeTruthy()
  })
  test('Should disconnect when disconnect is called', async () => {
    await MongoHelper.connect(MONGO_URL)

    let collection = MongoHelper.getCollection('any')
    expect(collection).toBeTruthy()

    await MongoHelper.disconnect()

    collection = MongoHelper.getCollection('any')
    expect(collection).toBeFalsy()
  })
})
