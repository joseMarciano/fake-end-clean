import { badRequest, serverError } from '../../../../presentation/helper/httpHelper'
import { LoginUser } from '../../../../domain/usecases/user/authentication/LoginUser'
import { Controller, HttpRequest, HttpResponse, Validator } from '../../../../presentation/protocols'

export class LoginController implements Controller {
  constructor (
    private readonly dbLoginUser: LoginUser,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const isValid = this.validator.validate(httpRequest)

      if (isValid) return badRequest(isValid)

      await this.dbLoginUser.login(httpRequest.body)
      return null as any
    } catch (error) {
      return serverError(error)
    }
  }
}
