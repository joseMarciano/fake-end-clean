import { FindUserByEmailRepository } from '../../data/protocols/user/FindUserByEmailRepository'
import { AddUserRepository } from '../../data/protocols/user/AddUserRepository'
import { User } from '../../domain/model/User'
import { UserModel } from '../../domain/usecases/user/add/AddUser'
import { MongoHelper } from '../db/mongo/mongoHelper'
import { UpdateUserRefreshTokenModel, UpdateUserRefreshTokenRepository } from '../../data/protocols/user/UpdateUserRefreshTokenRepository'
import { ActiveUserByIdRepository } from 'src/data/protocols/user/ActiveUserByIdRepository'
import { ObjectId } from 'mongodb'

interface BasicRepository
  extends
  AddUserRepository,
  FindUserByEmailRepository,
  UpdateUserRefreshTokenRepository,
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

  async updateRefreshToken (data: UpdateUserRefreshTokenModel): Promise<void> {
    const collection = await MongoHelper.getCollection('usersAccessToken')
    await collection.insertOne(data)
  }

  async activeById (id: string): Promise<User> {
    const mongoId = new ObjectId(id)
    const collection = await MongoHelper.getCollection('users')

    await collection.updateOne({ _id: mongoId }, {
      $set: {
        isActive: true
      }
    })

    const { _id, ...obj } = await collection.findOne({ _id: mongoId }) as any

    return {
      id: _id.toString(),
      ...obj
    }
  }
}
