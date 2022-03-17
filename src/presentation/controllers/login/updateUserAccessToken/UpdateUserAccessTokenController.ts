import { ok, serverError, unauthorized } from '../../../../presentation/helper/httpHelper'
import { UpdateUserAccessToken } from '../../../../domain/usecases/user/authentication/UpdateUserAccessToken'
import { Controller, HttpRequest, HttpResponse } from '../../../../presentation/protocols'

export class UpdateUserAccessTokenController implements Controller {
  constructor (
    private readonly dbUpdateUserAccessToken: UpdateUserAccessToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const newAccessToken = await this.dbUpdateUserAccessToken.updateUserAccessToken(httpRequest.body?.refreshToken)

      if (newAccessToken instanceof Error) {
        return unauthorized(newAccessToken)
      }

      return ok({ accessToken: newAccessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
