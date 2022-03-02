import { EmailInUseError } from '../../../../domain/usecases/user/validations/EmailInUseError'
import { AddUser } from '../../../../domain/usecases/user/add/AddUser'
import { badRequest, noContent, serverError } from '../../../helper/httpHelper'
import { Controller, HttpRequest, HttpResponse, Validator } from '../../../protocols'
import { Notification } from '../../../../data/notification/Notification'
import { Authentication } from '../../../../domain/usecases/user/authentication/Authentication'

export class SignUpController implements Controller {
  constructor (
    private readonly addUser: AddUser,
    private readonly validator: Validator,
    private readonly notification: Notification,
    private readonly authentication: Authentication
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

      const userAccess = await this.authentication.auth({
        email: result.email,
        password: body.password
      })

      await this.notification.send({
        to: result.email,
        subject: 'Welcome to fake end ✔',
        html: `<a target="_blank" href="http://localhost:8080/api/active?user=${userAccess}>Click here to activate your account</a>`
      })

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
