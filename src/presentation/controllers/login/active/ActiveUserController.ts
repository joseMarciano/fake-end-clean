import { ActivateUser } from '../../../../domain/usecases/user/activate/ActivateUser'
import { Controller, HttpRequest, HttpResponse } from '../../../../presentation/protocols'

export class ActiveUserController implements Controller {
  constructor (
    private readonly activateUser: ActivateUser
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.activateUser.active({
      id: 'any_id',
      email: 'any_email',
      isActive: false,
      name: 'any_name',
      password: 'any_password'
    })
    return await Promise.resolve({ body: null, statusCode: 999 })
  }
}
