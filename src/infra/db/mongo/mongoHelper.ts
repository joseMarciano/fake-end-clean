import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  url: null as unknown as string,
  async connect (url: string): Promise<void> {
    this.url = url
    this.client = await MongoClient.connect(url, {})
  },
  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },
  getCollection (collectionName: string): Collection {
    return this.client?.db().collection(collectionName)
  }

}
