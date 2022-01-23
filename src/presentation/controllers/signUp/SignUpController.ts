import { badRequest } from '../../helper/httpHelper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { MissingParamError } from '../errors/MissingParamError'

export class SignUpController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest

    if (!body?.name) {
      return badRequest(new MissingParamError('name'))
    }

    return await Promise.resolve({
      statusCode: 200,
      body: null
    })
  }
}
