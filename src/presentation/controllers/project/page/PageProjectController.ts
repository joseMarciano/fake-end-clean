import { ok, serverError } from '../../../../presentation/helper/httpHelper'
import { PageProject } from '../../../../domain/usecases/project/find/PageProject'
import { Controller, HttpRequest, HttpResponse } from '../../../../presentation/protocols'

export class PageProjectController implements Controller {
  constructor (
    private readonly dbPageProject: PageProject
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const page = await this.dbPageProject.page({
        offset: Number(httpRequest.params?.offset) || 0,
        limit: Number(httpRequest.params?.limit) || 20
      })

      return ok(page)
    } catch (error) {
      return serverError(error)
    }
  }
}
