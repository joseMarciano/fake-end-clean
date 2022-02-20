import { FindUserByEmailRepository } from '../../data/protocols/user/FindUserByEmailRepository'
import { AddUserRepository } from '../../data/protocols/user/AddUserRepository'
import { User, UserAccessToken } from '../../domain/model/User'
import { UserModel } from '../../domain/usecases/user/add/AddUser'
import { MongoHelper } from '../db/mongo/mongoHelper'
import { AddUserRefreshTokenModel, AddUserRefreshTokenRepository } from '../../data/protocols/user/AddUserRefreshTokenRepository'
import { ActiveUserByIdRepository } from '../../data/protocols/user/ActiveUserByIdRepository'
import { ObjectId } from 'mongodb'
import { AddUserAccessRepository, AddUserAccessTokenModel } from '../../data/protocols/user/AddUserAccessRepository'
import { FindUserAccessRepository } from '../../data/protocols/user/FindUserAccessRepository'
import { FindUserByIdRepository } from '../../data/protocols/user/FindUserByIdRepository'

interface BasicRepository
  extends
  FindUserByIdRepository,
  AddUserRepository,
  FindUserByEmailRepository,
  AddUserRefreshTokenRepository,
  ActiveUserByIdRepository,
  AddUserAccessRepository,
  FindUserAccessRepository
{}
export class UserMongoRespository implements BasicRepository {
  async add (userModel: UserModel): Promise<User> {
    const collection = await MongoHelper.getCollection('users')

    const userId = (await collection.insertOne(userModel)).insertedId

    const { _id, ...obj } = await collection.findOne({ _id: userId }) as any

    return {
      id: _id.toString(),
      ...obj
    }
  }

  async findByEmail (email: string): Promise<User> {
    const collection = await MongoHelper.getCollection('users')

    const userDocument = await collection.findOne({ email }) as any
    if (!userDocument) return null as any
    const { _id, ...obj } = userDocument

    return {
      id: _id.toString(),
      ...obj
    }
  }

  async addRefreshToken (data: AddUserRefreshTokenModel): Promise<void> {
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

  async findById (id: string): Promise<User> {
    const collection = await MongoHelper.getCollection('users')
    const result = await collection.findOne({ _id: new ObjectId(id) }) as any

    if (!result) return null as any
    const { _id, ...obj } = result

    return {
      id: _id.toString(),
      ...obj
    }
  }

  async addUserAccess (data: AddUserAccessTokenModel): Promise<void> {
    const collection = await MongoHelper.getCollection('usersAccessToken')
    await collection.insertOne({
      ...data,
      createdAt: new Date()
    })
  }

  async findUserAccess (userId: string, accessToken: string): Promise<UserAccessToken> {
    const collection = await MongoHelper.getCollection('usersAccessToken')
    const userAccessToken = await collection.findOne({
      userId,
      accessToken
    }) as any

    if (!userAccessToken) return null as any

    const { _id, ...obj } = userAccessToken

    return {
      id: _id.toString(),
      ...obj
    }
  }
}
