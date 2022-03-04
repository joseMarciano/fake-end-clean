import { ok } from '../../../../presentation/helper/httpHelper'
import { FindProjectById } from '../../../../domain/usecases/project/find/FindProjectById'
import { Controller, HttpRequest, HttpResponse } from '../../../../presentation/protocols'

export class FindProjectByIdController implements Controller {
  constructor (
    private readonly findProjectById: FindProjectById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return ok(await this.findProjectById.findById(httpRequest.paths.id))
  }
}
