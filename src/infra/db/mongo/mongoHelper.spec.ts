import { MongoHelper } from './mongoHelper'

describe('mongoHelper', () => {
  test('Should connect when connect is called', async () => {
    let collection = MongoHelper.getCollection('any')
    expect(collection).toBeFalsy()

    await MongoHelper.connect('mongodb://localhost:27017/fake-end')

    collection = MongoHelper.getCollection('any')
    expect(collection).toBeTruthy()
  })
})
