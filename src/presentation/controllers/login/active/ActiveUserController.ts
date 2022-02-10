import { serverError } from '../../../../presentation/helper/httpHelper'
import { ActivateUser } from '../../../../domain/usecases/user/activate/ActivateUser'
import { Controller, HttpRequest, HttpResponse } from '../../../../presentation/protocols'
import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'

export class ActiveUserController implements Controller {
  constructor (
    private readonly activateUser: ActivateUser,
    private readonly decrypter: Decrypter
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      await this.decrypter.decrypt(httpRequest.params?.user)

      await this.activateUser.active({
        id: 'any_id',
        email: 'any_email',
        isActive: false,
        name: 'any_name',
        password: 'any_password'
      })
      return await Promise.resolve({ body: null, statusCode: 999 })
    } catch (error) {
      return serverError(error)
    }
  }
}
