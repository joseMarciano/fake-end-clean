import { noContent, serverError, unauthorized } from '../../../presentation/helper/httpHelper'
import { AuthByToken } from '../../../domain/usecases/user/authentication/AuthByToken'
import { Controller, HttpRequest, HttpResponse } from '../../../presentation/protocols'
import { SetUserContext } from 'src/data/protocols/application/UserContext'

export class AuthController implements Controller {
  constructor (
    private readonly auth: AuthByToken,
    private readonly applicationContext: SetUserContext
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const user = await this.auth.authByToken(httpRequest.headers?.authorization)

      if (!user) return unauthorized()

      await this.applicationContext.setUser(user)

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
