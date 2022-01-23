import { AddUser } from 'src/domain/usecases/AddUser'
import { badRequest, ok, serverError } from '../../helper/httpHelper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { MissingParamError } from '../errors/MissingParamError'

export class SignUpController implements Controller {
  constructor (
    private readonly addUser: AddUser
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest

      if (!body?.name) {
        return badRequest(new MissingParamError('name'))
      }
      if (!body?.email) {
        return badRequest(new MissingParamError('email'))
      }

      const user = await this.addUser.add({
        email: body.email,
        name: body.name,
        password: body.password
      })

      return ok(user)
    } catch (error) {
      return serverError(error)
    }
  }
}
