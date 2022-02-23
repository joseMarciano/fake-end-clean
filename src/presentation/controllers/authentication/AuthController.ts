import { serverError } from '../../../presentation/helper/httpHelper'
import { AuthByToken } from '../../../domain/usecases/user/authentication/AuthByToken'
import { Controller, HttpRequest, HttpResponse } from '../../../presentation/protocols'

export class AuthController implements Controller {
  constructor (
    private readonly auth: AuthByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      await this.auth.authByToken(httpRequest.headers['user-access'])

      return await Promise.resolve(null as any)
    } catch (error) {
      return serverError(error)
    }
  }
}
