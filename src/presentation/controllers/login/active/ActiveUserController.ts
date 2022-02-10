import { serverError } from '../../../../presentation/helper/httpHelper'
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

      await this.findUserById.findById(id as string)

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
