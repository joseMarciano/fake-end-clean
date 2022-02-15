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

    await createUsersAccessTokenCollection(db)
    await createUsersRefreshTokenCollection(db)
  }
}

async function createUsersRefreshTokenCollection (db: Db): Promise<void> {
  const existsCollectionByName = await existsCollection(db, 'usersRefreshToken')
  if (existsCollectionByName) return
  const userAccessTokenCollection = await db.createCollection('usersRefreshToken')
  await userAccessTokenCollection.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 60 * 60 * 24 * 7 } // 7 days
  )
}

async function createUsersAccessTokenCollection (db: Db): Promise<void> {
  const existsCollectionByName = await existsCollection(db, 'usersAccessToken')
  if (existsCollectionByName) return
  const userAccessTokenCollection = await db.createCollection('usersAccessToken')
  await userAccessTokenCollection.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: (60 * 60) / 2 } // 30 minutes
  )
}

async function existsCollection (db: Db, collectionName: string): Promise<boolean> {
  const collections = db.listCollections()
  const arrayCollections = await collections.toArray()
  return arrayCollections.includes((collection: CollectionInfo) => collection.name === collectionName)
}
