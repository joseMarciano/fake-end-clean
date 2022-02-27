import { serverError } from '../../../../presentation/helper/httpHelper'
import { LoginUser } from '../../../../domain/usecases/user/authentication/LoginUser'
import { Controller, HttpRequest, HttpResponse, Validator } from '../../../../presentation/protocols'

export class LoginController implements Controller {
  constructor (
    private readonly dbLoginUser: LoginUser,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validator.validate(httpRequest)
      await this.dbLoginUser.login(httpRequest.body)
      return null as any
    } catch (error) {
      return serverError(error)
    }
  }
}
