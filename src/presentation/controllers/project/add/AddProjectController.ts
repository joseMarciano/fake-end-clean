import { ok, serverError } from '../../../../presentation/helper/httpHelper'
import { AddProject } from '../../../../domain/usecases/project/add/AddProject'
import { Controller, HttpRequest, HttpResponse, Validator } from '../../../../presentation/protocols'

export class AddProjectController implements Controller {
  constructor (
    private readonly addProject: AddProject,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validator.validate(httpRequest.body)
      this.validator.validate(httpRequest.params.userId)

      const userModel = {
        ...httpRequest.body,
        ...httpRequest.params
      }

      const project = await this.addProject.add(userModel)

      return ok(project)
    } catch (error) {
      return serverError(error)
    }
  }
}
