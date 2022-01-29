import { redirect } from '../../../../presentation/helper/httpHelper'
import { Controller, HttpRequest, HttpResponse } from '../../../../presentation/protocols'

export class GitHubSignUpController implements Controller {
  constructor (
    private readonly url: string
  ) {

  }

  async handle (_httpRequest: HttpRequest): Promise<HttpResponse> {
    // TODO ADICIONAR STATES
    return await Promise.resolve(redirect(`${this.url}`))
  }
}
