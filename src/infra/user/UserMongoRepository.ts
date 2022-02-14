import { FindUserByEmailRepository } from '../../data/protocols/user/FindUserByEmailRepository'
import { AddUserRepository } from '../../data/protocols/user/AddUserRepository'
import { User } from '../../domain/model/User'
import { UserModel } from '../../domain/usecases/user/add/AddUser'
import { MongoHelper } from '../db/mongo/mongoHelper'
import { UpdateUserAccessTokenModel, UpdateUserAccessTokenRepository } from '../../data/protocols/user/UpdateUserAccessTokenRepository'
import { ActiveUserByIdRepository } from 'src/data/protocols/user/ActiveUserByIdRepository'
import { ObjectId } from 'mongodb'

interface BasicRepository
  extends
  AddUserRepository,
  FindUserByEmailRepository,
  UpdateUserAccessTokenRepository,
  ActiveUserByIdRepository
{}
export class UserMongoRespository implements BasicRepository {
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

  async updateAccessToken (data: UpdateUserAccessTokenModel): Promise<void> {
    const collection = await MongoHelper.getCollection('usersAccessToken')
    await collection.insertOne(data)
  }

  async activeById (id: string): Promise<User> {
    const collection = await MongoHelper.getCollection('users')

    await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          isActive: true
        }
      })
    return null as unknown as User
  }
}
