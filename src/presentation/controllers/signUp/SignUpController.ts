import { AddUser } from 'src/domain/usecases/AddUser'
import { badRequest } from '../../helper/httpHelper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { MissingParamError } from '../errors/MissingParamError'

export class SignUpController implements Controller {
  constructor (
    private readonly addUser: AddUser
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest

    if (!body?.name) {
      return badRequest(new MissingParamError('name'))
    }
    if (!body?.email) {
      return badRequest(new MissingParamError('email'))
    }

    await this.addUser.add({
      email: body.email,
      name: body.name,
      password: body.password
    })

    return await Promise.resolve({
      statusCode: 200,
      body: null
    })
  }
}
