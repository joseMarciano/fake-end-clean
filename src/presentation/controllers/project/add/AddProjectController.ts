import { ok, serverError } from '../../../../presentation/helper/httpHelper'
import { AddProject } from '../../../../domain/usecases/project/add/AddProject'
import { Controller, HttpRequest, HttpResponse } from '../../../../presentation/protocols'

export class AddProjectController implements Controller {
  constructor (
    private readonly addProject: AddProject
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
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
