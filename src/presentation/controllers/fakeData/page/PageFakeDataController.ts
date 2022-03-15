import { ok, serverError } from '../../../helper/httpHelper'
import { Controller, HttpRequest, HttpResponse } from '../../../protocols'
import { PageFakeData } from 'src/domain/usecases/fakeData/find/PageFakeData'

export class PageFakeDataController implements Controller {
  constructor (
    private readonly dbPageFakeData: PageFakeData
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const page = await this.dbPageFakeData.page({
        offset: Number(httpRequest.params?.offset) || 0,
        limit: Number(httpRequest.params?.limit) || 20
      })

      return ok(page)
    } catch (error) {
      return serverError(error)
    }
  }
}
