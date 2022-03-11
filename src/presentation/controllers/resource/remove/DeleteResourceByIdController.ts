import { badRequest, noContent, serverError } from '../../../helper/httpHelper'
import { DeleteProjectById } from '../../../../domain/usecases/project/remove/DeleteProjectById'
import { Controller, HttpRequest, HttpResponse, Validator } from '../../../protocols'

export class DeleteResourceByIdController implements Controller {
  constructor (
    private readonly deleteProjectById: DeleteProjectById,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest)
      if (error) return badRequest(error)
      await this.deleteProjectById.deleteById(httpRequest.paths.id)
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
