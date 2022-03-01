import { LoginUserError } from '../../../../domain/usecases/user/validations/LoginUserError'
import { AccessToken, LoginUser, LoginUserModel } from '../../../../domain/usecases/user/authentication/LoginUser'
import { FindUserByEmailRepository } from '../../../../data/protocols/user/FindUserByEmailRepository'
import { HashCompare } from '../../../../data/protocols/cryptography/HashCompare'
import { RandomStringGenerator } from '../../../../data/protocols/cryptography/RandomStringGenerator'

export class DbLoginUser implements LoginUser {
  constructor (
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly hasherCompare: HashCompare,
    private readonly randomStringGenerator: RandomStringGenerator
  ) {}

  async login (userLoginModel: LoginUserModel): Promise<AccessToken | LoginUserError> {
    const user = await this.findUserByEmailRepository.findByEmail(userLoginModel.email)
    const passwordIsValid = await this.hasherCompare.compare(userLoginModel.password, user?.password as string)

    if (!user || !passwordIsValid) return new LoginUserError('Email or password are incorrects')

    await this.randomStringGenerator.generateRandomString()

    return null as any
  }
}
