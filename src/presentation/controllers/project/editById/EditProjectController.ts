import { EditProject } from '../../../../domain/usecases/project/edit/EditProject'
import { badRequest, ok, serverError } from '../../../helper/httpHelper'
import { Controller, HttpRequest, HttpResponse, Validator } from '../../../protocols'

export class EditProjectController implements Controller {
  constructor (
    private readonly editProject: EditProject,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const isValid = this.validator.validate(httpRequest)
      if (isValid) return badRequest(isValid)
      return ok(await this.editProject.edit(httpRequest.body))
    } catch (error) {
      return serverError(error)
    }
  }
}
