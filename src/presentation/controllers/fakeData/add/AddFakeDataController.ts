import { ok, serverError } from '../../../../presentation/helper/httpHelper'
import { AddFakeData } from '../../../../domain/usecases/fakeData/add/AddFakeData'
import { Controller, HttpRequest, HttpResponse, Validator } from '../../../../presentation/protocols'

export class AddFakeDataController implements Controller {
  constructor (
    private readonly addFakeData: AddFakeData,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validator.validate(httpRequest)
      const fakeDataModel = await this.addFakeData.add(httpRequest.body)
      return ok(fakeDataModel)
    } catch (error) {
      return serverError(error)
    }
  }
}
