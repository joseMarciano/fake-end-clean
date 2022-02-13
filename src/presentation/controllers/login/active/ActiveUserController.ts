import { ok, serverError } from '../../../../presentation/helper/httpHelper'
import { Controller, HttpRequest, HttpResponse } from '../../../../presentation/protocols'
import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'
import { ActivateUser } from '../../../../domain/usecases/user/activate/ActivateUser'

export class ActiveUserController implements Controller {
  constructor (
    private readonly activateUser: ActivateUser,
    private readonly decrypter: Decrypter
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const user = await this.activateUser.active({ encryptedValue: httpRequest.params.user })

      return ok(user)
    } catch (error) {
      return serverError(error)
    }
  }
}
