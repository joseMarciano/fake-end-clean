import { badRequest, ok, serverError } from '../../../../presentation/helper/httpHelper'
import { AddProject } from '../../../../domain/usecases/project/add/AddProject'
import { Controller, HttpRequest, HttpResponse, Validator } from '../../../../presentation/protocols'

export class AddProjectController implements Controller {
  constructor (
    private readonly addProject: AddProject,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest)

      if (error) return badRequest(error)

      const userModel = {
        ...httpRequest.body,
        ...httpRequest.params
      }

      const result = await this.addProject.add(userModel)

      if (result instanceof Error) return badRequest(result)

      return ok(result)
    } catch (error) {
      return serverError(error)
    }
  }
}
