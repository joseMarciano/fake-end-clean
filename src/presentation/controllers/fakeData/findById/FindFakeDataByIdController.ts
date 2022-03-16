import { FindFakeDataById } from '../../../../domain/usecases/fakeData/find/FindFakeDataById'
import { ok, serverError } from '../../../helper/httpHelper'
import { Controller, HttpRequest, HttpResponse } from '../../../protocols'

export class FindFakeDataByIdController implements Controller {
  constructor (
    private readonly editFakeData: FindFakeDataById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const fakeDataModel = await this.editFakeData.findById(httpRequest.paths.id)
      return ok(fakeDataModel)
    } catch (error) {
      return serverError(error)
    }
  }
}
