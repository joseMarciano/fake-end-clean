import { FindAllFakeData } from '../../../../domain/usecases/fakeData/find/FindAllFakeData'
import { ok, serverError } from '../../../helper/httpHelper'
import { Controller, HttpRequest, HttpResponse } from '../../../protocols'

export class FindAllFakeDataController implements Controller {
  constructor (
    private readonly findAllFakeData: FindAllFakeData
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const fakeDataModel = await this.findAllFakeData.findAll()
      return ok(fakeDataModel)
    } catch (error) {
      return serverError(error)
    }
  }
}
