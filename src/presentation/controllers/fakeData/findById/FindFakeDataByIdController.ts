import { FindFakeDataById } from 'src/domain/usecases/fakeData/find/FindFakeDataById'
import { badRequest, ok, serverError } from '../../../helper/httpHelper'
import { Controller, HttpRequest, HttpResponse, Validator } from '../../../protocols'

export class FindFakeDataByIdController implements Controller {
  constructor (
    private readonly editFakeData: FindFakeDataById,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest)

      if (error) return badRequest(error)

      const fakeDataModel = await this.editFakeData.findById(httpRequest.paths.id)
      return ok(fakeDataModel)
    } catch (error) {
      return serverError(error)
    }
  }
}
