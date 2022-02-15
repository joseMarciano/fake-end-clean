import { badRequest, forbiden, ok, serverError } from '../../../../presentation/helper/httpHelper'
import { Controller, HttpRequest, HttpResponse, Validator } from '../../../../presentation/protocols'
import { ActivateUser } from '../../../../domain/usecases/user/activate/ActivateUser'
import { ActivateUserError } from '../../../../domain/usecases/user/validations/ActivateUserError'

export class ActiveUserController implements Controller {
  constructor (
    private readonly activateUser: ActivateUser,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.params)

      if (error) return badRequest(error)

      const result = await this.activateUser.active({ encryptedValue: httpRequest.params.user })

      if (result instanceof ActivateUserError) {
        return forbiden(result)
      }

      return ok(result)
    } catch (error) {
      return serverError(error)
    }
  }
}
