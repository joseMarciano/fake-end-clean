import { DeleteFakeDataById } from '../../../../domain/usecases/fakeData/remove/DeleteFakeDataById'
import { noContent, serverError } from '../../../helper/httpHelper'
import { Controller, HttpRequest, HttpResponse } from '../../../protocols'

export class DeleteFakeDataByIdController implements Controller {
  constructor (
    private readonly deleteFakeData: DeleteFakeDataById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      await this.deleteFakeData.deleteById(httpRequest.paths.id)
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
