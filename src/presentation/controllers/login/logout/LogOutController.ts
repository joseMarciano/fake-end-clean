import { LogOutUser } from '../../../../domain/usecases/user/authentication/LogOutUser'
import { noContent, serverError } from '../../../helper/httpHelper'
import { Controller, HttpRequest, HttpResponse } from '../../../protocols'

export class LogOutController implements Controller {
  constructor (
    private readonly dbLogOutUser: LogOutUser
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      await this.dbLogOutUser.logout(httpRequest.headers.authorization)
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
