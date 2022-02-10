import { noContent, serverError } from '../../../../presentation/helper/httpHelper'
import { ActivateUser } from '../../../../domain/usecases/user/activate/ActivateUser'
import { Controller, HttpRequest, HttpResponse } from '../../../../presentation/protocols'
import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'
import { FindUserById } from '../../../../domain/usecases/user/find/FindUserById'

export class ActiveUserController implements Controller {
  constructor (
    private readonly activateUser: ActivateUser,
    private readonly decrypter: Decrypter,
    private readonly findUserById: FindUserById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = await this.decrypter.decrypt(httpRequest.params?.user)
      const user = await this.findUserById.findById(id as string)
      await this.activateUser.active(user)

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
