import { LoginUserError } from '../../../../domain/usecases/user/validations/LoginUserError'
import { AccessToken, LoginUser, LoginUserModel } from '../../../../domain/usecases/user/authentication/LoginUser'
import { FindUserByEmailRepository } from '../../../../data/protocols/user/FindUserByEmailRepository'
import { HashCompare } from '../../../../data/protocols/cryptography/HashCompare'
import { RandomStringGenerator } from '../../../../data/protocols/cryptography/RandomStringGenerator'
import { AddUserRefreshTokenRepository } from '../../../../data/protocols/user/AddUserRefreshTokenRepository'
import { Encrypter } from '../../../../data/protocols/cryptography/Encrypter'
import { AddUserAccessRepository } from '../../../../data/protocols/user/AddUserAccessRepository'

export class DbLoginUser implements LoginUser {
  constructor (
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly hasherCompare: HashCompare,
    private readonly randomStringGenerator: RandomStringGenerator,
    private readonly addRefreshTokenRepository: AddUserRefreshTokenRepository,
    private readonly encrypter: Encrypter,
    private readonly addUserAccessRepository: AddUserAccessRepository
  ) {}

  async login (userLoginModel: LoginUserModel): Promise<AccessToken | LoginUserError> {
    const user = await this.findUserByEmailRepository.findByEmail(userLoginModel.email)
    const passwordIsValid = await this.hasherCompare.compare(userLoginModel.password, user?.password as string)

    if (!user || !passwordIsValid) return new LoginUserError('Email or password are incorrects')

    const refreshToken = await this.randomStringGenerator.generateRandomString()

    await this.addRefreshTokenRepository.addRefreshToken({
      refreshToken,
      userId: user.id
    })

    const accessToken = await this.encrypter.encrypt({
      id: user.id,
      email: user.email
    })

    await this.addUserAccessRepository.addUserAccess({
      userId: user.id,
      accessToken
    })

    return {
      accessToken,
      refreshToken
    }
  }
}
