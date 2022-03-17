import { noContent, serverError, unauthorized } from '../../../presentation/helper/httpHelper'
import { AuthByToken } from '../../../domain/usecases/user/authentication/AuthByToken'
import { Controller, HttpRequest, HttpResponse } from '../../../presentation/protocols'
import { SetUserContext } from '../../../data/protocols/application/UserContext'

export class AuthController implements Controller {
  constructor (
    private readonly auth: AuthByToken,
    private readonly applicationContext: SetUserContext
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.auth.authByToken(httpRequest.headers.authorization)

      if (result instanceof Error) return unauthorized(result)

      await this.applicationContext.setUser(result)

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
