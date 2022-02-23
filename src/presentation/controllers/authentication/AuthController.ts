import { noContent, serverError, unauthorized } from '../../../presentation/helper/httpHelper'
import { AuthByToken } from '../../../domain/usecases/user/authentication/AuthByToken'
import { Controller, HttpRequest, HttpResponse } from '../../../presentation/protocols'

export class AuthController implements Controller {
  constructor (
    private readonly auth: AuthByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const isAuthenticated = await this.auth.authByToken(httpRequest.headers['user-access'])

      if (!isAuthenticated) return unauthorized()

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
