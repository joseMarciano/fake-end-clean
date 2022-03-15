import { EditFakeData } from '../../../../domain/usecases/fakeData/edit/EditFakeData'
import { badRequest, ok, serverError } from '../../../../presentation/helper/httpHelper'
import { Controller, HttpRequest, HttpResponse, Validator } from '../../../../presentation/protocols'

export class EditFakeDataController implements Controller {
  constructor (
    private readonly editFakeData: EditFakeData,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest)

      if (error) return badRequest(error)

      const fakeDataModel = await this.editFakeData.edit(httpRequest.body)
      return ok(fakeDataModel)
    } catch (error) {
      return serverError(error)
    }
  }
}
