import { noContent, serverError } from '../../../../presentation/helper/httpHelper'
import { Controller, HttpRequest, HttpResponse } from '../../../../presentation/protocols'
import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'
import { ActivateUserByEmail } from '../../../../domain/usecases/user/activate/ActivateUserByEmail'

export class ActiveUserController implements Controller {
  constructor (
    private readonly activateUserByEmail: ActivateUserByEmail,
    private readonly decrypter: Decrypter
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email } = await this.decrypter.decrypt(httpRequest.params?.user)
      await this.activateUserByEmail.activeByEmail(email)

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
