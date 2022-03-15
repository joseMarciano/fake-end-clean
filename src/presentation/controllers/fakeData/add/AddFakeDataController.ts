import { AddFakeData } from '../../../../domain/usecases/fakeData/add/AddFakeData'
import { Controller, HttpRequest, HttpResponse } from '../../../../presentation/protocols'

export class AddFakeDataController implements Controller {
  constructor (
    private readonly addFakeData: AddFakeData
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.addFakeData.add(httpRequest.body)
    return null as any
  }
}
