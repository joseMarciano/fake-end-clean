import { FindUserByEmailRepository } from '../../data/protocols/FindUserByEmailRepository'
import { AddUserRepository } from '../../data/protocols/AddUserRepository'
import { User } from '../../domain/model/User'
import { UserModel } from '../../domain/usecases/user/AddUser'
import { MongoHelper } from '../db/mongo/mongoHelper'

export class UserMongoRespository implements AddUserRepository, FindUserByEmailRepository {
  async add (userModel: UserModel): Promise<User> {
    const collection = await MongoHelper.getCollection('users')

    const userId = (await collection.insertOne(userModel)).insertedId

    const { _id, ...obj } = await collection.findOne({ _id: userId }) as any

    return {
      id: _id,
      ...obj
    }
  }

  async findByEmail (email: string): Promise<User> {
    const collection = await MongoHelper.getCollection('users')

    const userDocument = await collection.findOne({ email }) as any
    if (!userDocument) return null as any
    const { _id, ...obj } = userDocument

    return {
      id: _id,
      ...obj
    }
  }
}
