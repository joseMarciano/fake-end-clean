import { serverError } from '../../../../presentation/helper/httpHelper'
import { PageProject } from '../../../../domain/usecases/project/find/PageProject'
import { Controller, HttpRequest, HttpResponse } from '../../../../presentation/protocols'

export class PageProjectController implements Controller {
  constructor (
    private readonly dbPageProject: PageProject
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      await this.dbPageProject.page({
        offset: httpRequest.params?.offset || 0,
        limit: httpRequest.params?.limit || 20
      })

      return null as any
    } catch (error) {
      return serverError(error)
    }
  }
}
