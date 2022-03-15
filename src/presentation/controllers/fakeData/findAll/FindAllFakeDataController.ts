import { FindAllFakeData } from '../../../../domain/usecases/fakeData/find/FindAllFakeData'
import { badRequest, ok, serverError } from '../../../helper/httpHelper'
import { Controller, HttpRequest, HttpResponse, Validator } from '../../../protocols'

export class FindAllFakeDataController implements Controller {
  constructor (
    private readonly findAllFakeData: FindAllFakeData,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest)

      if (error) return badRequest(error)

      const fakeDataModel = await this.findAllFakeData.findAll()
      return ok(fakeDataModel)
    } catch (error) {
      return serverError(error)
    }
  }
}
