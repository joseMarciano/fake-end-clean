import { LoginUserError } from '../../../../domain/usecases/user/validations/LoginUserError'
import { AccessToken, LoginUser, LoginUserModel } from '../../../../domain/usecases/user/authentication/LoginUser'
import { FindUserByEmailRepository } from '../../../../data/protocols/user/FindUserByEmailRepository'

export class DbLoginUser implements LoginUser {
  constructor (
    private readonly findUserByEmailRepository: FindUserByEmailRepository
  ) {}

  async login (userLoginModel: LoginUserModel): Promise<AccessToken | LoginUserError> {
    await this.findUserByEmailRepository.findByEmail(userLoginModel.email)
    return null as any
  }
}
