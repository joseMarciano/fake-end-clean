import { LoginUser } from '../../../../domain/usecases/user/authentication/LoginUser'
import { Controller, HttpRequest, HttpResponse } from '../../../../presentation/protocols'

export class LoginController implements Controller {
  constructor (
    private readonly dbLoginUser: LoginUser
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.dbLoginUser.login(httpRequest.body)
    return null as any
  }
}
