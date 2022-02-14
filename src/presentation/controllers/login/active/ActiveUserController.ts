import { badRequest, ok, serverError } from '../../../../presentation/helper/httpHelper'
import { Controller, HttpRequest, HttpResponse, Validator } from '../../../../presentation/protocols'
import { ActivateUser } from '../../../../domain/usecases/user/activate/ActivateUser'

export class ActiveUserController implements Controller {
  constructor (
    private readonly activateUser: ActivateUser,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.params)

      if (error) return badRequest(error)

      const user = await this.activateUser.active({ encryptedValue: httpRequest.params.user })

      return ok(user)
    } catch (error) {
      return serverError(error)
    }
  }
}
