import { EditFakeData } from '../../../../domain/usecases/fakeData/edit/EditFakeData'
import { ok, serverError } from '../../../../presentation/helper/httpHelper'
import { Controller, HttpRequest, HttpResponse } from '../../../../presentation/protocols'

export class EditFakeDataController implements Controller {
  constructor (
    private readonly editFakeData: EditFakeData
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const fakeDataModel = await this.editFakeData.edit(httpRequest.body)
      return ok(fakeDataModel)
    } catch (error) {
      return serverError(error)
    }
  }
}
