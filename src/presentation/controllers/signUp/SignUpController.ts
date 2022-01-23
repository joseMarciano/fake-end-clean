import { Controller, HttpRequest, HttpResponse } from 'src/presentation/protocols'

export class SignUpController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest

    if (!body?.name) {
      return {
        body: new Error()
      }
    }

    return await Promise.resolve({
      body: null
    })
  }
}
