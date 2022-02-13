import { noContent, serverError } from '../../../../presentation/helper/httpHelper'
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
      const result = await this.decrypter.decrypt(httpRequest.params?.user)
      await this.activateUser.active(result)

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
