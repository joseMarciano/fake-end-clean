import { EmailInUseError } from '../../../../domain/usecases/user/validations/EmailInUseError'
import { AddUser } from '../../../../domain/usecases/user/add/AddUser'
import { badRequest, noContent, serverError } from '../../../helper/httpHelper'
import { Controller, HttpRequest, HttpResponse, Validator } from '../../../protocols'
import { Notification } from '../../../../data/notification/Notification'

export class SignUpController implements Controller {
  constructor (
    private readonly addUser: AddUser,
    private readonly validator: Validator,
    private readonly notification: Notification
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

      await this.notification.send(result.email)

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}