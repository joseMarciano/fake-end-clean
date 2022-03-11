import { FindResourcesByProjectId } from '../../../../domain/usecases/resource/findByProjectId/FindResourcesByProjectId'
import { badRequest, ok, serverError } from '../../../helper/httpHelper'
import { Controller, HttpRequest, HttpResponse, Validator } from '../../../protocols'

export class FindResourcesByProjectIdController implements Controller {
  constructor (
    private readonly findResourceByProjectId: FindResourcesByProjectId,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const isValid = this.validator.validate(httpRequest)
      if (isValid) return badRequest(isValid)
      return ok(await this.findResourceByProjectId.findByProjectId(httpRequest.paths.projectId))
    } catch (error) {
      return serverError(error)
    }
  }
}
