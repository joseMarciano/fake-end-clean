import { EmailInUseError } from '../../../domain/usecases/user/validations/EmailInUseError'
import { AddUser } from '../../../domain/usecases/user/AddUser'
import { badRequest, ok, serverError } from '../../helper/httpHelper'
import { Controller, HttpRequest, HttpResponse, Validator } from '../../protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addUser: AddUser,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest

      const validationError = this.validator.validate(body)

      if (validationError) return badRequest(validationError)

      const result = await this.addUser.add({
        email: body.email,
        name: body.name,
        password: body.password,
        isActive: false
      })
      if (result instanceof EmailInUseError) {
        return badRequest(result)
      }

      return ok(result)
    } catch (error) {
      return serverError(error)
    }
  }
}
