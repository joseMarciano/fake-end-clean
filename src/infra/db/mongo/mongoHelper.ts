import { Collection, CollectionInfo, Db, MongoClient } from 'mongodb'

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
  async getCollection (collectionName: string): Promise<Collection> {
    if (!this.client || !this.client.db) await this.connect(this.url)

    return this.client.db().collection(collectionName)
  },
  async createCustomCollections (): Promise<void> {
    const db = this.client.db()

    await createUsersAccessToken(db)
  }
}

async function createUsersAccessToken (db: Db): Promise<void> {
  const existsCollectionByName = await existsCollection(db, 'usersAccessToken')
  if (existsCollectionByName) return
  const userAccessTokenCollection = await db.createCollection('usersAccessToken')
  await userAccessTokenCollection.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 60 * 60 } // 1 hour
  )
}

async function existsCollection (db: Db, collectionName: string): Promise<boolean> {
  const collections = db.listCollections()
  const arrayCollections = await collections.toArray()
  return arrayCollections.includes((collection: CollectionInfo) => collection.name === collectionName)
}
