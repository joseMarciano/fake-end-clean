import { AddUserRepository } from 'src/data/protocols/AddUserRepository'
import { User } from 'src/domain/model/User'
import { UserModel } from 'src/domain/usecases/AddUser'
import { MongoHelper } from '../db/mongo/mongoHelper'

export class UserMongoRespository implements AddUserRepository {
  async add (userModel: UserModel): Promise<User> {
    const collection = await MongoHelper.getCollection('users')

    const userId = (await collection.insertOne(userModel)).insertedId

    const { _id, ...obj } = await collection.findOne({ _id: userId }) as any

    return {
      id: _id,
      ...obj
    }
  }
}
