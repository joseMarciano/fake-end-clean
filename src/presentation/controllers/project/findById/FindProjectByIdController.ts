import { badRequest, ok, serverError } from '../../../../presentation/helper/httpHelper'
import { FindProjectById } from '../../../../domain/usecases/project/find/FindProjectById'
import { Controller, HttpRequest, HttpResponse, Validator } from '../../../../presentation/protocols'

export class FindProjectByIdController implements Controller {
  constructor (
    private readonly findProjectById: FindProjectById,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const isValid = this.validator.validate(httpRequest)

      if (isValid) return badRequest(isValid)

      return ok(await this.findProjectById.findById(httpRequest.paths.id))
    } catch (error) {
      return serverError(error)
    }
  }
}
